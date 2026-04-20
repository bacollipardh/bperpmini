import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MovementType } from '@prisma/client';
import { StockService } from '../stock/stock.service';
import { PrismaService } from '../prisma/prisma.service';

const mockBalance = {
  warehouseId: 'wh-1',
  itemId: 'item-1',
  qtyOnHand: 10,
  avgCost: 100,
};

const mockPrisma = {
  stockBalance: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  stockMovement: {
    create: jest.fn(),
  },
};

describe('StockService', () => {
  let service: StockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    jest.clearAllMocks();
  });

  describe('ensureSufficientStock', () => {
    it('passes when stock is sufficient', async () => {
      mockPrisma.stockBalance.findUnique.mockResolvedValueOnce(mockBalance);
      await expect(
        service.ensureSufficientStock({ warehouseId: 'wh-1', itemId: 'item-1', requestedQty: 5 }),
      ).resolves.not.toThrow();
    });

    it('throws when stock is insufficient', async () => {
      mockPrisma.stockBalance.findUnique.mockResolvedValueOnce({ ...mockBalance, qtyOnHand: 3 });
      await expect(
        service.ensureSufficientStock({ warehouseId: 'wh-1', itemId: 'item-1', requestedQty: 5 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws when no balance exists', async () => {
      mockPrisma.stockBalance.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.ensureSufficientStock({ warehouseId: 'wh-1', itemId: 'item-1', requestedQty: 1 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('applyMovement — PURCHASE_IN updates avgCost', () => {
    it('creates balance with correct avgCost when none exists', async () => {
      mockPrisma.stockMovement.create.mockResolvedValueOnce({});
      mockPrisma.stockBalance.findUnique.mockResolvedValueOnce(null);
      mockPrisma.stockBalance.create.mockResolvedValueOnce({});

      await service.applyMovement(mockPrisma as any, {
        warehouseId: 'wh-1',
        itemId: 'item-1',
        movementType: MovementType.PURCHASE_IN,
        qtyIn: 10,
        unitCost: 50,
        movementAt: new Date(),
      });

      expect(mockPrisma.stockBalance.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ qtyOnHand: 10, avgCost: 50 }) }),
      );
    });
  });
});
