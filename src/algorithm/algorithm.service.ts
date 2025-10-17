import { Injectable } from '@nestjs/common';
import { CreateAlgorithmDto } from './dto/create-algorithm.dto';
import { UpdateAlgorithmDto } from './dto/update-algorithm.dto';

@Injectable()
export class AlgorithmService {
  create(createAlgorithmDto: CreateAlgorithmDto) {
    return 'This action adds a new algorithm';
  }

  findAll() {
    return `This action returns all algorithm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} algorithm`;
  }

  update(id: number, updateAlgorithmDto: UpdateAlgorithmDto) {
    return `This action updates a #${id} algorithm`;
  }

  remove(id: number) {
    return `This action removes a #${id} algorithm`;
  }
}
