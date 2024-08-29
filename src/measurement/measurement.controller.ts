import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { Measurement } from './entities/measurement.entity';
import { IMeasurement } from './interfaces/measurement.interface';
import { MeasurementService } from './measurement.service';

@Controller('measurements')
export class MeasurementController {
    constructor(private readonly measurementService: MeasurementService) { }

    @Post('upload')
    async uploadMeasurement(@Body() body: Omit<IMeasurement, "measure_uuid" | "measure_value" | "has_confirmed">): Promise<Measurement> {
        const { customer_code, measure_datetime, measure_type, image } = body;
        return this.measurementService.createMeasurement({
            customer_code, measure_datetime, measure_type, image,
        });
    }

    @Patch('confirm')
    @HttpCode(HttpStatus.OK)
    async confirmMeasurement(@Body() body: Pick<IMeasurement, "measure_uuid"> & { confirmed_value: number }): Promise<void> {
        const { measure_uuid, confirmed_value } = body;
        return this.measurementService.confirmMeasurement(measure_uuid, confirmed_value);
    }

    @Get(':customer_code/list')
    async listMeasurements(
        @Param('customer_code') customerCode: string,
        @Query('measure_type') measureType?: 'WATER' | 'GAS',
    ): Promise<Measurement[]> {
        return this.measurementService.listMeasurements(customerCode, measureType);
    }
}