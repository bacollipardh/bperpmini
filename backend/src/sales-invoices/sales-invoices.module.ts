import { Module } from '@nestjs/common';
import { SalesInvoicesService } from './sales-invoices.service';
import { SalesInvoicesController } from './sales-invoices.controller';
import { StockModule } from '../stock/stock.module';

@Module({
  imports: [StockModule],
  controllers: [SalesInvoicesController],
  providers: [SalesInvoicesService],
  exports: [SalesInvoicesService],
})
export class SalesInvoicesModule {}
