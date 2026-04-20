import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PurchaseInvoicesService } from './purchase-invoices.service';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('purchase-invoices')
@ApiBearerAuth()
@Controller('purchase-invoices')
export class PurchaseInvoicesController {
  constructor(private readonly purchaseInvoicesService: PurchaseInvoicesService) {}

  @Get()
  findAll() {
    return this.purchaseInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseInvoicesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePurchaseInvoiceDto, @CurrentUser() user: JwtPayload) {
    return this.purchaseInvoicesService.create(dto, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseInvoiceDto) {
    return this.purchaseInvoicesService.update(id, dto);
  }

  @Post(':id/post')
  post(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.purchaseInvoicesService.post(id, user.sub);
  }
}
