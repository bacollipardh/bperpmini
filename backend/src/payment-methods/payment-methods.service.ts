import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/createPaymentMethod.dto';
import { UpdatePaymentMethodDto } from './dto/updatePaymentMethod.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class PaymentMethodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogs: AuditLogsService,
  ) {}

  findAll() {
    return this.prisma.paymentMethod.findMany({

      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const record = await this.prisma.paymentMethod.findUnique({
      where: { id },

    });

    if (!record) {
      throw new NotFoundException('PaymentMethod not found');
    }

    return record;
  }

  async create(dto: CreatePaymentMethodDto) {
    const exists = await this.prisma.paymentMethod.findUnique({
      where: { code: dto.code },
    });

    if (exists) {
      throw new ConflictException('PaymentMethod code already exists');
    }

    const record = await this.prisma.paymentMethod.create({
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'payment_methods',
      entityId: record.id,
      action: 'CREATE',
      metadata: { code: record.code },
    });

    return record;
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    await this.findOne(id);

    const record = await this.prisma.paymentMethod.update({
      where: { id },
      data: dto as any,
    });

    await this.auditLogs.log({
      entityType: 'payment_methods',
      entityId: record.id,
      action: 'UPDATE',
      metadata: dto,
    });

    return record;
  }
}
