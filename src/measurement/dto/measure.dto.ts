import { IsBoolean, IsDateString, IsString, IsUUID } from 'class-validator';

export class MeasureDto {
    @IsUUID()
    measure_uuid: string;

    @IsDateString()
    measure_datetime: Date;

    @IsString()
    measure_type: string;

    @IsBoolean()
    has_confirmed: boolean;

    @IsString()
    image_url: string;
}