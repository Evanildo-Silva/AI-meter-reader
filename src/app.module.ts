import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReaderModule } from './reader/reader.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env.development.local'],
  }), ReaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
