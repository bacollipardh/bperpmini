import { IsBoolean, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateTaxRateDto {
  @IsString()

  @MaxLength(20)

  code: string;

  @IsString()

  @MaxLength(50)

  name: string;

  @IsNumber()

  @Min(0)

  @Max(100)

  ratePercent: number;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;
}
