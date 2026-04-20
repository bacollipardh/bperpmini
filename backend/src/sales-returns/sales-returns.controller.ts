import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SalesReturnsService } from './sales-returns.service';
import { CreateSalesReturnDto } from './dto/create-sales-return.dto';
import { UpdateSalesReturnDto } from './dto/update-sales-return.dto';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('sales-returns')
@ApiBearerAuth()
@Controller('sales-returns')
export class SalesReturnsController {
  constructor(private readonly salesReturnsService: SalesReturnsService) {}

  @Get()
  findAll() {
    return this.salesReturnsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesReturnsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSalesReturnDto, @CurrentUser() user: JwtPayload) {
    return this.salesReturnsService.create(dto, user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSalesReturnDto) {
    return this.salesReturnsService.update(id, dto);
  }

  @Post(':id/post')
  post(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.salesReturnsService.post(id, user.sub);
  }
}
