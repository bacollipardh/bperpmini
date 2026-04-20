import { Module } from '@nestjs/common';
import { DocumentSeriesService } from './document-series.service';
import { DocumentSeriesController } from './document-series.controller';

@Module({
  controllers: [DocumentSeriesController],
  providers: [DocumentSeriesService],
  exports: [DocumentSeriesService],
})
export class DocumentSeriesModule {}
