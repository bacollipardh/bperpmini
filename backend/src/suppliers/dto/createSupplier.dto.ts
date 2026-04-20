import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateSupplierDto {
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

  @IsInt()

  @Min(0)

  paymentTermsDays?: number;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;

  @IsOptional()

  @IsString()

  notes?: string;
}
