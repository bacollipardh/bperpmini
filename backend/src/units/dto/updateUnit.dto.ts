import { PartialType } from '@nestjs/mapped-types';
import { CreateUnitDto } from './createUnit.dto';

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
