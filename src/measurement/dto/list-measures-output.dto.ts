import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { MeasureDto } from './measure.dto';

export class ListMeasuresOutputDto {
    @IsString()
    customer_code: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MeasureDto)
    measures: MeasureDto[];
}