import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemCategoryDto } from './dto/createItemCategory.dto';
import { UpdateItemCategoryDto } from './dto/updateItemCategory.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class ItemCategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.itemCategory.findMany({
      include: { parent: true, children: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.itemCategory.findUnique({
      where: { id },
      include: { parent: true, children: true },
    });

    if (!record) {
      throw new NotFoundException('ItemCategory not found');
    }

    return record;
  }

  async create(dto: CreateItemCategoryDto) {
    const exists = await this.prisma.itemCategory.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('ItemCategory code already exists');
    }

    const record = await this.prisma.itemCategory.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'item_categories',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateItemCategoryDto) {
    await this.findOne(id);

    const record = await this.prisma.itemCategory.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'item_categories',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
