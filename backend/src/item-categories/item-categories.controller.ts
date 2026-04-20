import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemCategoriesService } from './item-categories.service';
import { CreateItemCategoryDto } from './dto/createItemCategory.dto';
import { UpdateItemCategoryDto } from './dto/updateItemCategory.dto';

@Controller('item-categories')
export class ItemCategoriesController {
  constructor(private readonly service: ItemCategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemCategoryDto) {
    return this.service.update(id, dto);
  }
}
