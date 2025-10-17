import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { CreateAlgorithmDto } from './dto/create-algorithm.dto';
import { UpdateAlgorithmDto } from './dto/update-algorithm.dto';

@Controller('algorithm')
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {}

  @Post()
  create(@Body() createAlgorithmDto: CreateAlgorithmDto) {
    return this.algorithmService.create(createAlgorithmDto);
  }

  @Get()
  findAll() {
    return this.algorithmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.algorithmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlgorithmDto: UpdateAlgorithmDto) {
    return this.algorithmService.update(+id, updateAlgorithmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.algorithmService.remove(+id);
  }
}
