import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentSeriesDto } from './createDocumentSeries.dto';

export class UpdateDocumentSeriesDto extends PartialType(CreateDocumentSeriesDto) {}
