import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto } from './dto/createWarehouse.dto';
import { UpdateWarehouseDto } from './dto/updateWarehouse.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.warehouse.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.warehouse.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('Warehouse not found');
    }

    return record;
  }

  async create(dto: CreateWarehouseDto) {
    const exists = await this.prisma.warehouse.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Warehouse code already exists');
    }

    const record = await this.prisma.warehouse.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'warehouses',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateWarehouseDto) {
    await this.findOne(id);

    const record = await this.prisma.warehouse.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'warehouses',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
