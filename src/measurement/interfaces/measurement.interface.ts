export interface IMeasurement {
    measure_uuid: string;
    measure_datetime: Date;
    measure_type: 'WATER' | 'GAS';
    image: string;
    customer_code: string;
    measure_value: number;
    has_confirmed: boolean;
}