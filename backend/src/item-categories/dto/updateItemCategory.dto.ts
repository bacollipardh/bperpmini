import { PartialType } from '@nestjs/mapped-types';
import { CreateItemCategoryDto } from './createItemCategory.dto';

export class UpdateItemCategoryDto extends PartialType(CreateItemCategoryDto) {}
