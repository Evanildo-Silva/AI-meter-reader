import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IMeasurement } from '../interfaces/measurement.interface';

@Entity()
export class Measurement implements IMeasurement {
    @PrimaryGeneratedColumn('uuid')
    measure_uuid: string;

    @CreateDateColumn()
    measure_datetime: Date;

    @Column()
    measure_type: 'WATER' | 'GAS';

    @Column()
    image: string;

    @Column()
    customer_code: string;

    @Column('decimal', { precision: 10, scale: 2 })
    measure_value: number;

    @Column({ default: false })
    has_confirmed: boolean;
}