import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.service.update(id, dto);
  }
}
