import { IsOptional, IsUUID } from 'class-validator';

export class StockBalanceQueryDto {
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsUUID()
  itemId?: string;
}
