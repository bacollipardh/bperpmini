import { Module } from '@nestjs/common';
import { ItemCategoriesService } from './item-categories.service';
import { ItemCategoriesController } from './item-categories.controller';

@Module({
  controllers: [ItemCategoriesController],
  providers: [ItemCategoriesService],
  exports: [ItemCategoriesService],
})
export class ItemCategoriesModule {}
