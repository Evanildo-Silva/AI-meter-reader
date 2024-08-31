import { IsDateString, IsEnum, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsBase64Validator } from 'src/utils/IsBase64Validator';

export class UploadMeasureDto {
    @IsNotEmpty()
    @IsString()
    @Validate(IsBase64Validator)
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