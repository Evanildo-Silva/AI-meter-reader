import { Injectable } from '@nestjs/common';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';

@Injectable()
export class ReaderService {
  create(createReaderDto: CreateReaderDto) {
    return 'This action adds a new reader';
  }

  findAll() {
    return `This action returns all reader`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reader`;
  }

  update(id: number, updateReaderDto: UpdateReaderDto) {
    return `This action updates a #${id} reader`;
  }

  remove(id: number) {
    return `This action removes a #${id} reader`;
  }
}
