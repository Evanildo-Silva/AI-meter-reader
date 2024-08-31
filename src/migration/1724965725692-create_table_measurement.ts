import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMeasurementTable1688160180563 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE measure_type_enum AS ENUM ('WATER', 'GAS')
        `);

        await queryRunner.createTable(
            new Table({
                name: 'measurement',
                columns: [
                    {
                        name: 'measure_uuid',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'measure_datetime',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'measure_type',
                        type: 'measure_type_enum',
                    },
                    {
                        name: 'image_url',
                        type: 'varchar',
                    },
                    {
                        name: 'customer_code',
                        type: 'varchar',
                    },
                    {
                        name: 'measure_value',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: 'has_confirmed',
                        type: 'boolean',
                        default: false,
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('measurement');

        await queryRunner.query(`
            DROP TYPE measure_type_enum
        `);
    }
}
