import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseDto } from './createWarehouse.dto';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {}
