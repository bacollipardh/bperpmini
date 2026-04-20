import { IsOptional, IsUUID } from 'class-validator';

export class StockMovementQueryDto {
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsUUID()
  itemId?: string;
}
