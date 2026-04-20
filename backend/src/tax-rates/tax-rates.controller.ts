import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TaxRatesService } from './tax-rates.service';
import { CreateTaxRateDto } from './dto/createTaxRate.dto';
import { UpdateTaxRateDto } from './dto/updateTaxRate.dto';

@Controller('tax-rates')
export class TaxRatesController {
  constructor(private readonly service: TaxRatesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaxRateDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaxRateDto) {
    return this.service.update(id, dto);
  }
}
