import { IsBoolean } from 'class-validator';

export class ConfirmMeasureOutputDto {
    @IsBoolean()
    success: boolean;
}