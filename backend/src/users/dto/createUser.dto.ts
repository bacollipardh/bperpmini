import { IsBoolean, IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  roleId: string;

  @IsString()
  @MaxLength(150)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
