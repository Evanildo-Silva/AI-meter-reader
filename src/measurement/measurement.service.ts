import { GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { saveBase64Image } from 'src/utils/saveBase64Image';
import { prompt } from 'src/utils/stringPrompts';
import { Between, Repository } from 'typeorm';
import { ConfirmMeasureOutputDto } from './dto/confirm-measure-output.dto';
import { ListMeasuresOutputDto } from './dto/list-measures-output.dto';
import { UploadMeasureOutputDto } from './dto/upload-measure-output.dto';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { Measurement } from './entities/measurement.entity';

@Injectable()
export class MeasurementService {
    constructor(
        @InjectRepository(Measurement)
        private measurementRepository: Repository<Measurement>,
    ) { }

    async createMeasurement(measureData: UploadMeasureDto): Promise<UploadMeasureOutputDto> {
        const { customer_code, measure_datetime, measure_type, image } = measureData;
        const month = new Date(measure_datetime).getMonth();
        const year = new Date(measure_datetime).getFullYear();

        const existingMeasurement = await this.measurementRepository.findOne({
            where: {
                customer_code,
                measure_type,
                measure_datetime: Between(new Date(year, month, 1), new Date(year, month + 1, 0)),
            },
        });

        if (existingMeasurement) {
            throw new ConflictException({
                "error_code": "DOUBLE_REPORT",
                "error_description": "Leitura do mês já realizada"
            });
        }

        const { imageUrl, fileType, imageSplit } = saveBase64Image(image, customer_code)

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([{
            inlineData: {
                mimeType: fileType,
                data: imageSplit
            }
        }, prompt]);
        const measureValue = result.response.text().trim();
        console.log("==measureValue==", measureValue)
        const measurement = this.measurementRepository.create({
            measure_datetime,
            measure_type,
            measure_value: Number(measureValue),
            customer_code,
            image_url: imageUrl
        });

        const savedMeasurement = await this.measurementRepository.save(measurement);

        return {
            measure_uuid: savedMeasurement.measure_uuid,
            measure_value: savedMeasurement.measure_value,
            image_url: savedMeasurement.image_url
        };
    }

    async confirmMeasurement(measureUUID: string, confirmedValue: number): Promise<ConfirmMeasureOutputDto> {
        const measurement = await this.measurementRepository.findOne({ where: { measure_uuid: measureUUID } });

        if (!measurement) {
            throw new NotFoundException(
                {
                    "error_code": "MEASURE_NOT_FOUND",
                    "error_description": "Leitura do mês já realizada"
                }
            );
        }

        if (measurement.has_confirmed) {
            throw new ConflictException(
                {
                    "error_code":
                        "CONFIRMATION_DUPLICATE",
                    "error_description": "Leitura do mês já realizada"
                }
            );
        }

        await this.measurementRepository.update(
            { measure_uuid: measureUUID },
            { measure_value: confirmedValue, has_confirmed: true }
        );


        return { success: true }
    }

    async listMeasurements(customerCode: string, measureType?: 'WATER' | 'GAS'): Promise<ListMeasuresOutputDto> {
        const { customer_code } = await this.measurementRepository.findOne({ where: { customer_code: customerCode } });
        if (!customer_code) {
            throw new NotFoundException(
                {
                    "error_code": "CUSTOMER_NOT_FOUND",
                    "error_description": "Customer not found"
                }
            );
        }

        const replaceMeasureType = measureType.toLocaleUpperCase()

        if (measureType && !['WATER', 'GAS'].includes(replaceMeasureType)) {
            throw new BadRequestException(
                {
                    "error_code": "INVALID_TYPE",
                    "error_description": "Tipo de medição não permitida"
                }
            );
        }

        const query = this.measurementRepository.createQueryBuilder('measurement')
            .where('measurement.customer_code = :customer_code', { customer_code });

        if (measureType) {
            query.andWhere('measurement.measure_type = :replaceMeasureType', { replaceMeasureType });
        }

        const measurements = await query.getMany();
        if (measurements.length === 0) {
            throw new NotFoundException(
                {
                    "error_code": "MEASURES_NOT_FOUND",
                    "error_description": "Nenhuma leitura encontrada"
                }
            );
        }

        return {
            customer_code: customerCode,
            measures: measurements
        };
    }
}