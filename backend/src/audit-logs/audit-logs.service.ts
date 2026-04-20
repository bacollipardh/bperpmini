import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
  }

  async log(params: {
    userId?: string | null;
    entityType: string;
    entityId: string;
    action: string;
    metadata?: unknown;
  }) {
    return this.prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        metadata: params.metadata as any,
      },
    });
  }
}
