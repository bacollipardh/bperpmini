import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaxRateDto } from './dto/createTaxRate.dto';
import { UpdateTaxRateDto } from './dto/updateTaxRate.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class TaxRatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.taxRate.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.taxRate.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('TaxRate not found');
    }

    return record;
  }

  async create(dto: CreateTaxRateDto) {
    const exists = await this.prisma.taxRate.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('TaxRate code already exists');
    }

    const record = await this.prisma.taxRate.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'tax_rates',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateTaxRateDto) {
    await this.findOne(id);

    const record = await this.prisma.taxRate.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'tax_rates',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
