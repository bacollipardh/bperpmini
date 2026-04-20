import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/createCustomer.dto';
import { UpdateCustomerDto } from './dto/updateCustomer.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.customer.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.customer.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('Customer not found');
    }

    return record;
  }

  async create(dto: CreateCustomerDto) {
    const exists = await this.prisma.customer.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('Customer code already exists');
    }

    const record = await this.prisma.customer.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'customers',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    const record = await this.prisma.customer.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'customers',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
