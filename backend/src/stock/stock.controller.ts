import { Controller, Get, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockBalanceQueryDto } from './dto/stock-balance-query.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('balance')
  findBalances(@Query() query: StockBalanceQueryDto) {
    return this.stockService.findBalances(query);
  }

  @Get('movements')
  findMovements(@Query() query: StockMovementQueryDto) {
    return this.stockService.findMovements(query);
  }
}
