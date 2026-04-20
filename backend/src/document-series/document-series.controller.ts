import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { DocumentSeriesService } from './document-series.service';
import { CreateDocumentSeriesDto } from './dto/createDocumentSeries.dto';
import { UpdateDocumentSeriesDto } from './dto/updateDocumentSeries.dto';

@Controller('document-series')
export class DocumentSeriesController {
  constructor(private readonly service: DocumentSeriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDocumentSeriesDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocumentSeriesDto) {
    return this.service.update(id, dto);
  }
}
