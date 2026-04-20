import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentSeriesDto } from './dto/createDocumentSeries.dto';
import { UpdateDocumentSeriesDto } from './dto/updateDocumentSeries.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class DocumentSeriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.documentSeries.findMany({

      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.documentSeries.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('DocumentSeries not found');
    }

    return record;
  }

  async create(dto: CreateDocumentSeriesDto) {
    const exists = await this.prisma.documentSeries.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('DocumentSeries code already exists');
    }

    const record = await this.prisma.documentSeries.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'document_series',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateDocumentSeriesDto) {
    await this.findOne(id);

    const record = await this.prisma.documentSeries.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'document_series',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
