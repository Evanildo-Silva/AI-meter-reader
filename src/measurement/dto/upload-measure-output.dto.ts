import { IsInt, IsString, IsUUID } from 'class-validator';

export class UploadMeasureOutputDto {
    @IsString()
    image_url: string;

    @IsInt()
    measure_value: number;

    @IsUUID()
    measure_uuid: string;
}