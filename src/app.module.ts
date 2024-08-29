import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeasurementModule } from './measurement/measurement.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development.local'],
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    entities: [`${__dirname}/**/*.entity{.js,.ts}`],
    migrations: [`${__dirname}/migration/{.ts,*.js}`],
    migrationsRun: true,
  }),
    MeasurementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
