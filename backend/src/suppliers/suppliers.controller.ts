import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/createSupplier.dto';
import { UpdateSupplierDto } from './dto/updateSupplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly service: SuppliersService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.service.update(id, dto);
  }
}
