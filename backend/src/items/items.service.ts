import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';
import { UpdateItemDto } from './dto/updateItem.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.item.findMany({
      include: { category: true, unit: true, taxRate: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.item.findUnique({
      where: { id },
      include: { category: true, unit: true, taxRate: true },
    });

    if (!record) {
      throw new NotFoundException('Item not found');
    }

    return record;
  }

  async create(dto: CreateItemDto) {
    const exists = await this.prisma.item.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Item code already exists');
    }

    const record = await this.prisma.item.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'items',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateItemDto) {
    await this.findOne(id);

    const record = await this.prisma.item.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'items',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
