import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmMeasureDto {
    @IsNotEmpty()
    @IsUUID()
    measure_uuid: string;

    @IsNotEmpty()
    @IsInt()
    confirmed_value: number;
}