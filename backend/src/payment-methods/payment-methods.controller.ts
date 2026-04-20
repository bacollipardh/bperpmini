import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/createPaymentMethod.dto';
import { UpdatePaymentMethodDto } from './dto/updatePaymentMethod.dto';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly service: PaymentMethodsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePaymentMethodDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    return this.service.update(id, dto);
  }
}
