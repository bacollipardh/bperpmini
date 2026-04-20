import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()

  @MaxLength(50)

  code: string;

  @IsOptional()

  @IsString()

  @MaxLength(100)

  barcode?: string;

  @IsString()

  @MaxLength(200)

  name: string;

  @IsOptional()

  @IsString()

  description?: string;

  @IsUUID()

  categoryId: string;

  @IsUUID()

  unitId: string;

  @IsUUID()

  taxRateId: string;

  @IsNumber()

  @Min(0)

  standardPurchasePrice: number;

  @IsNumber()

  @Min(0)

  standardSalesPrice: number;

  @IsOptional()

  @IsNumber()

  @Min(0)

  minSalesPrice?: number;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;
}
