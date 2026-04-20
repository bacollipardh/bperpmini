import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
