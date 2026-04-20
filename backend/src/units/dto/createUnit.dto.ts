import { IsString, MaxLength } from 'class-validator';

export class CreateUnitDto {
  @IsString()

  @MaxLength(20)

  code: string;

  @IsString()

  @MaxLength(50)

  name: string;
}
