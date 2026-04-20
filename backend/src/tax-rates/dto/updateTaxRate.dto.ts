import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxRateDto } from './createTaxRate.dto';

export class UpdateTaxRateDto extends PartialType(CreateTaxRateDto) {}
