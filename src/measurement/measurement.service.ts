import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Between, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Measurement } from './entities/measurement.entity';
import { IMeasurement } from './interfaces/measurement.interface';


@Injectable()
export class MeasurementService {
    constructor(
        @InjectRepository(Measurement)
        private measurementRepository: Repository<Measurement>,
    ) { }

    async createMeasurement(measureData: Omit<IMeasurement, "measure_uuid" | "measure_value" | "has_confirmed">): Promise<Measurement> {
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
            throw new ConflictException('Measurement already exists for this month');
        }

        const geminiResponse = await axios.post('https://api.google.com/gemini', { image });
        const measureValue = geminiResponse.data.value || Math.random() * 100; // Mocked response
        const measureUUID = uuidv4();
        const imageUrl = `https://fakeurl.com/${measureUUID}`;

        const measurement = this.measurementRepository.create({
            measure_datetime,
            measure_type,
            measure_value: measureValue,
            customer_code,
        });

        const savedMeasurement = await this.measurementRepository.save(measurement);

        return savedMeasurement;
    }

    async confirmMeasurement(measureUUID: string, confirmedValue: number): Promise<void> {
        const measurement = await this.measurementRepository.findOne({ where: { measure_uuid: measureUUID } });

        if (!measurement) {
            throw new NotFoundException('Measurement not found');
        }

        if (measurement.has_confirmed) {
            throw new ConflictException('Measurement already confirmed');
        }

        measurement.measure_value = confirmedValue;
        measurement.has_confirmed = true;

        await this.measurementRepository.save(measurement);
    }

    async listMeasurements(customerCode: string, measureType?: 'WATER' | 'GAS'): Promise<Measurement[]> {
        const customer = await this.measurementRepository.findOne({ where: { customer_code: customerCode } });
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const query = this.measurementRepository.createQueryBuilder('measurement')
            .where('measurement.customer = :customer', { customer });

        if (measureType) {
            query.andWhere('measurement.measure_type = :measureType', { measureType });
        }

        const measurements = await query.getMany();
        if (measurements.length === 0) {
            throw new NotFoundException('No measurements found');
        }

        return measurements;
    }
}