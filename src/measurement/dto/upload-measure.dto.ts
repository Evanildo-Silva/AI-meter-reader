import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UploadMeasureDto {
    @IsNotEmpty()
    @IsString()
    image: string;

    @IsNotEmpty()
    @IsString()
    customer_code: string;

    @IsNotEmpty()
    @IsDateString()
    measure_datetime: string;

    @IsNotEmpty()
    @IsEnum(['WATER', 'GAS'])
    measure_type: 'WATER' | 'GAS';
}