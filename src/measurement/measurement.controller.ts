import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { CustomValidationPipe } from 'src/utils/customValidationPipes';
import { ConfirmMeasureOutputDto } from './dto/confirm-measure-output.dto';
import { ListMeasuresOutputDto } from './dto/list-measures-output.dto';
import { UploadMeasureOutputDto } from './dto/upload-measure-output.dto';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { IMeasurement } from './interfaces/measurement.interface';
import { MeasurementService } from './measurement.service';

@Controller('/')
export class MeasurementController {
    constructor(
        private readonly measurementService: MeasurementService,
    ) { }

    @Post('upload')
    @UsePipes(new CustomValidationPipe())
    async uploadMeasurement(@Body() body: UploadMeasureDto): Promise<UploadMeasureOutputDto> {
        const { customer_code, measure_datetime, measure_type, image } = body;
        return this.measurementService.createMeasurement({
            customer_code, measure_datetime, measure_type, image,
        });
    }

    @Patch('confirm')
    @HttpCode(HttpStatus.OK)
    async confirmMeasurement(@Body() body: Pick<IMeasurement, "measure_uuid"> & { confirmed_value: number }): Promise<ConfirmMeasureOutputDto> {
        const { measure_uuid, confirmed_value } = body;

        return this.measurementService.confirmMeasurement(measure_uuid, confirmed_value);
    }

    @Get(':customer_code/list')
    async listMeasurements(
        @Param('customer_code') customerCode: string,
        @Query('measure_type') measureType?: 'WATER' | 'GAS',
    ): Promise<ListMeasuresOutputDto> {
        return this.measurementService.listMeasurements(customerCode, measureType);
    }
}