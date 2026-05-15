import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../prisma/prisma.service';
import { OrdersGateway } from './orders.gateway';
import { AuditLogService } from '../../audit/audit-log.service';

describe('OrdersService', () => {
  let service: OrdersService;
  const prismaMock = {} as unknown as PrismaService;
  const queueAdd = jest.fn().mockResolvedValue(undefined);
  const gatewayMock = { emitOrderStatus: jest.fn() };
  const auditLogMock = { log: jest.fn().mockResolvedValue(undefined) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prismaMock },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(`${60 * 60 * 1000}`) },
        },
        { provide: OrdersGateway, useValue: gatewayMock },
        { provide: getQueueToken('orders'), useValue: { add: queueAdd } },
        { provide: AuditLogService, useValue: auditLogMock },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    queueAdd.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
