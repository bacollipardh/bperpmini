import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { PurchaseInvoicesService } from '../purchase-invoices/purchase-invoices.service';
import { SalesInvoicesService } from '../sales-invoices/sales-invoices.service';
import { SalesReturnsService } from '../sales-returns/sales-returns.service';

@ApiTags('pdf')
@ApiBearerAuth()
@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly purchaseInvoicesService: PurchaseInvoicesService,
    private readonly salesInvoicesService: SalesInvoicesService,
    private readonly salesReturnsService: SalesReturnsService,
  ) {}

  @Get('purchase-invoices/:id')
  async purchaseInvoice(@Param('id') id: string, @Res() res: Response) {
    const invoice = await this.purchaseInvoicesService.findOne(id);
    const buffer = this.pdfService.generatePurchaseInvoicePdf(invoice);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="purchase-invoice-${invoice.docNo}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('sales-invoices/:id')
  async salesInvoice(@Param('id') id: string, @Res() res: Response) {
    const invoice = await this.salesInvoicesService.findOne(id);
    const buffer = this.pdfService.generateSalesInvoicePdf(invoice);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="sales-invoice-${invoice.docNo}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('sales-returns/:id')
  async salesReturn(@Param('id') id: string, @Res() res: Response) {
    const ret = await this.salesReturnsService.findOne(id);
    const buffer = this.pdfService.generateSalesReturnPdf(ret);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="sales-return-${ret.docNo}.pdf"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
