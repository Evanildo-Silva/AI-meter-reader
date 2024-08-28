import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderService } from './reader.service';

@Controller('reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) { }

  @Post('/upload')
  create(@Body() createReaderDto: CreateReaderDto) {
    return this.readerService.create(createReaderDto);
  }

  @Get(':id/list')
  findOne(@Param('id') id: string) {
    return this.readerService.findOne(+id);
  }

  @Patch('/confirm')
  update(@Param('id') id: string, @Body() updateReaderDto: UpdateReaderDto) {
    return this.readerService.update(+id, updateReaderDto);
  }
}
