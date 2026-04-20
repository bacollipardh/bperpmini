import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateItemCategoryDto {
  @IsString()

  @MaxLength(30)

  code: string;

  @IsString()

  @MaxLength(100)

  name: string;

  @IsOptional()

  @IsUUID()

  parentId?: string;
}
