import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { fullName: 'asc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        roleId: true,
        role: { select: { id: true, code: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!record) throw new NotFoundException('User not found');

    const { passwordHash: _, ...safe } = record;
    return safe;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('User email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const record = await this.prisma.user.create({
      data: {
        roleId: dto.roleId,
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
        isActive: dto.isActive ?? true,
      },
      include: { role: true },
    });

    await this.auditLogs.log({
      entityType: 'users',
      entityId: record.id,
      action: 'CREATE',
      metadata: { email: record.email },
    });

    const { passwordHash: _, ...safe } = record;
    return safe;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {
      roleId: dto.roleId,
      fullName: dto.fullName,
      email: dto.email,
      isActive: dto.isActive,
    };

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 12);
    }

    Object.keys(data).forEach((k) => data[k] === undefined && delete data[k]);

    const record = await this.prisma.user.update({ where: { id }, data, include: { role: true } });

    await this.auditLogs.log({
      entityType: 'users',
      entityId: record.id,
      action: 'UPDATE',
      metadata: { email: record.email },
    });

    const { passwordHash: _, ...safe } = record;
    return safe;
  }
}
