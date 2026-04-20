import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCustomerDto {
  @IsString()

  @MaxLength(30)

  code: string;

  @IsString()

  @MaxLength(200)

  name: string;

  @IsOptional()

  @IsString()

  @MaxLength(50)

  fiscalNo?: string;

  @IsOptional()

  @IsString()

  @MaxLength(50)

  vatNo?: string;

  @IsOptional()

  @IsString()

  @MaxLength(255)

  address?: string;

  @IsOptional()

  @IsString()

  @MaxLength(100)

  city?: string;

  @IsOptional()

  @IsString()

  @MaxLength(50)

  phone?: string;

  @IsOptional()

  @IsEmail()

  email?: string;

  @IsOptional()

  @IsNumber()

  @Min(0)

  creditLimit?: number;

  @IsOptional()

  @IsNumber()

  @Min(0)

  @Max(100)

  defaultDiscountPercent?: number;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;

  @IsOptional()

  @IsString()

  notes?: string;
}
