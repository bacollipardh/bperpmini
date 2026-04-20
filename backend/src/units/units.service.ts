import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto } from './dto/createUnit.dto';
import { UpdateUnitDto } from './dto/updateUnit.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.unit.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.unit.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('Unit not found');
    }

    return record;
  }

  async create(dto: CreateUnitDto) {
    const exists = await this.prisma.unit.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Unit code already exists');
    }

    const record = await this.prisma.unit.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'units',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateUnitDto) {
    await this.findOne(id);

    const record = await this.prisma.unit.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'units',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
