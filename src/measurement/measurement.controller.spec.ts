import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmMeasureOutputDto } from './dto/confirm-measure-output.dto';
import { ListMeasuresOutputDto } from './dto/list-measures-output.dto';
import { UploadMeasureOutputDto } from './dto/upload-measure-output.dto';
import { UploadMeasureDto } from './dto/upload-measure.dto';
import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './measurement.service';

describe('MeasurementController', () => {
    let measurementController: MeasurementController;
    let measurementService: MeasurementService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MeasurementController],
            providers: [
                {
                    provide: MeasurementService,
                    useValue: {
                        createMeasurement: jest.fn(),
                        confirmMeasurement: jest.fn(),
                        listMeasurements: jest.fn(),
                    },
                },
            ],
        }).compile();

        measurementController = module.get<MeasurementController>(MeasurementController);
        measurementService = module.get<MeasurementService>(MeasurementService);
    });

    describe('uploadMeasurement', () => {
        it('should upload a measurement and return the output', async () => {
            const uploadMeasureDto: UploadMeasureDto = {
                customer_code: 'CUSTOMER123',
                measure_datetime: '2024-01-01T12:00:00Z',
                measure_type: 'WATER',
                image: 'data:image/jpeg;base64,...',
            };

            const uploadMeasureOutputDto: UploadMeasureOutputDto = {
                measure_uuid: 'uuid-1234',
                measure_value: 123.45,
                image_url: 'http://example.com/image.jpg',
            };

            jest.spyOn(measurementService, 'createMeasurement').mockResolvedValue(uploadMeasureOutputDto);

            const result = await measurementController.uploadMeasurement(uploadMeasureDto);
            expect(result).toEqual(uploadMeasureOutputDto);
            expect(measurementService.createMeasurement).toHaveBeenCalledWith(uploadMeasureDto);
        });
    });

    describe('confirmMeasurement', () => {
        it('should confirm a measurement and return the output', async () => {
            const measure_uuid = 'uuid-1234';
            const confirmed_value = 150;
            const confirmMeasureOutputDto: ConfirmMeasureOutputDto = { success: true };

            jest.spyOn(measurementService, 'confirmMeasurement').mockResolvedValue(confirmMeasureOutputDto);

            const result = await measurementController.confirmMeasurement({ measure_uuid, confirmed_value });
            expect(result).toEqual(confirmMeasureOutputDto);
            expect(measurementService.confirmMeasurement).toHaveBeenCalledWith(measure_uuid, confirmed_value);
        });
    });

    describe('listMeasurements', () => {
        it('should list measurements for a customer and return the output', async () => {
            const customerCode = 'CUSTOMER123';
            const measureType = 'WATER';
            const listMeasuresOutputDto: ListMeasuresOutputDto = {
                customer_code: customerCode,
                measures: [
                    {
                        measure_uuid: 'uuid-1234',
                        measure_datetime: new Date('2024-01-01T12:00:00Z'),
                        measure_type: 'WATER',
                        image_url: 'http://example.com/image.jpg',
                        has_confirmed: true,
                    },
                ],
            };

            jest.spyOn(measurementService, 'listMeasurements').mockResolvedValue(listMeasuresOutputDto);

            const result = await measurementController.listMeasurements(customerCode, measureType);
            expect(result).toEqual(listMeasuresOutputDto);
            expect(measurementService.listMeasurements).toHaveBeenCalledWith(customerCode, measureType);
        });
    });
});
