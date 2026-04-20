import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/createWarehouse.dto';
import { UpdateWarehouseDto } from './dto/updateWarehouse.dto';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.service.update(id, dto);
  }
}
