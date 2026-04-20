import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()

  @MaxLength(20)

  code: string;

  @IsString()

  @MaxLength(50)

  name: string;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;
}
