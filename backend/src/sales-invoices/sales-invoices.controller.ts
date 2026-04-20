import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalesInvoicesService } from './sales-invoices.service';
import { CreateSalesInvoiceDto } from './dto/create-sales-invoice.dto';
import { UpdateSalesInvoiceDto } from './dto/update-sales-invoice.dto';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('sales-invoices')
@ApiBearerAuth()
@Controller('sales-invoices')
export class SalesInvoicesController {
  constructor(private readonly salesInvoicesService: SalesInvoicesService) {}

  @Get()
  findAll() {
    return this.salesInvoicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesInvoicesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSalesInvoiceDto, @CurrentUser() user: JwtPayload) {
    return this.salesInvoicesService.create(dto, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalesInvoiceDto) {
    return this.salesInvoicesService.update(id, dto);
  }

  @Post(':id/post')
  post(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.salesInvoicesService.post(id, user.sub);
  }
}
