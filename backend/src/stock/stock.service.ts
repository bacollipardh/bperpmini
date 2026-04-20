import { BadRequestException, Injectable } from '@nestjs/common';
import { MovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  findBalances(query?: { warehouseId?: string; itemId?: string }) {
    return this.prisma.stockBalance.findMany({
      where: {
        warehouseId: query?.warehouseId,
        itemId: query?.itemId,
      },
      include: { item: true, warehouse: true },
      orderBy: [{ warehouseId: 'asc' }, { itemId: 'asc' }],
    });
  }

  findMovements(query?: { warehouseId?: string; itemId?: string }) {
    return this.prisma.stockMovement.findMany({
      where: {
        warehouseId: query?.warehouseId,
        itemId: query?.itemId,
      },
      include: { item: true, warehouse: true },
      orderBy: { movementAt: 'desc' },
      take: 1000,
    });
  }

  async ensureSufficientStock(params: {
    warehouseId: string;
    itemId: string;
    requestedQty: number;
  }) {
    const balance = await this.prisma.stockBalance.findUnique({
      where: {
        warehouseId_itemId: {
          warehouseId: params.warehouseId,
          itemId: params.itemId,
        },
      },
    });

    const available = Number(balance?.qtyOnHand ?? 0);
    if (available < params.requestedQty) {
      throw new BadRequestException(`Insufficient stock for item ${params.itemId}`);
    }
  }

  async applyMovement(tx: PrismaService | any, params: {
    warehouseId: string;
    itemId: string;
    movementType: MovementType;
    qtyIn?: number;
    qtyOut?: number;
    unitCost?: number | null;
    purchaseInvoiceId?: string;
    salesInvoiceId?: string;
    salesReturnId?: string;
    referenceNo?: string;
    movementAt?: Date;
  }) {
    const qtyIn = Number(params.qtyIn ?? 0);
    const qtyOut = Number(params.qtyOut ?? 0);

    await tx.stockMovement.create({
      data: {
        warehouseId: params.warehouseId,
        itemId: params.itemId,
        movementType: params.movementType,
        qtyIn,
        qtyOut,
        unitCost: params.unitCost ?? null,
        purchaseInvoiceId: params.purchaseInvoiceId,
        salesInvoiceId: params.salesInvoiceId,
        salesReturnId: params.salesReturnId,
        referenceNo: params.referenceNo,
        movementAt: params.movementAt ?? new Date(),
      },
    });

    const current = await tx.stockBalance.findUnique({
      where: {
        warehouseId_itemId: {
          warehouseId: params.warehouseId,
          itemId: params.itemId,
        },
      },
    });

    const currentQty = Number(current?.qtyOnHand ?? 0);
    const currentAvg = Number(current?.avgCost ?? 0);
    const newQty = currentQty + qtyIn - qtyOut;

    let newAvg = currentAvg;

    if (params.movementType === MovementType.PURCHASE_IN && qtyIn > 0) {
      const incomingCost = Number(params.unitCost ?? 0);
      const totalCostBefore = currentQty * currentAvg;
      const totalCostAfter = totalCostBefore + qtyIn * incomingCost;
      newAvg = newQty > 0 ? totalCostAfter / newQty : 0;
    }

    if (!current) {
      await tx.stockBalance.create({
        data: {
          warehouseId: params.warehouseId,
          itemId: params.itemId,
          qtyOnHand: newQty,
          avgCost: newAvg,
        },
      });
      return;
    }

    await tx.stockBalance.update({
      where: {
        warehouseId_itemId: {
          warehouseId: params.warehouseId,
          itemId: params.itemId,
        },
      },
      data: {
        qtyOnHand: newQty,
        avgCost: newAvg,
      },
    });
  }
}
