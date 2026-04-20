import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierDto } from './dto/createSupplier.dto';
import { UpdateSupplierDto } from './dto/updateSupplier.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class SuppliersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.supplier.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.supplier.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('Supplier not found');
    }

    return record;
  }

  async create(dto: CreateSupplierDto) {
    const exists = await this.prisma.supplier.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Supplier code already exists');
    }

    const record = await this.prisma.supplier.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'suppliers',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateSupplierDto) {
    await this.findOne(id);

    const record = await this.prisma.supplier.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'suppliers',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
