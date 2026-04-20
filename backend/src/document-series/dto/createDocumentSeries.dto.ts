import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateDocumentSeriesDto {
  @IsString()

  @MaxLength(30)

  code: string;

  @IsString()

  @MaxLength(30)

  documentType: string;

  @IsString()

  @MaxLength(20)

  prefix: string;

  @IsOptional()

  @IsInt()

  @Min(1)

  nextNumber?: number;

  @IsOptional()

  @IsBoolean()

  isActive?: boolean;
}
