import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/createUnit.dto';
import { UpdateUnitDto } from './dto/updateUnit.dto';

@Controller('units')
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUnitDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.service.update(id, dto);
  }
}
