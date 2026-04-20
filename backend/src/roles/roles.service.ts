import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.role.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.role.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('Role not found');
    }

    return record;
  }

  async create(dto: CreateRoleDto) {
    const exists = await this.prisma.role.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Role code already exists');
    }

    const record = await this.prisma.role.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'roles',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);

    const record = await this.prisma.role.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'roles',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
