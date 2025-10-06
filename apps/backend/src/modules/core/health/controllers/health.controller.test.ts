import { MockMethodFactory, TMockPropsOf } from '@bcm/testing';

import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';

import { HealthController } from './health.controller';

describe('[controllers] - HealthController', () => {
  const context = {} as TMockPropsOf<
    'controller',
    HealthController,
    {
      service: HealthCheckService;
      mongo: MongooseHealthIndicator;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useFactory: () =>
            new MockMethodFactory<HealthCheckService>()
              .add('check', jest.fn())
              .build(),
        },
        {
          provide: MongooseHealthIndicator,
          useFactory: () =>
            new MockMethodFactory<MongooseHealthIndicator>()
              .add('pingCheck', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.controller = moduleRef.get(HealthController);
    context.others = {
      mongo: moduleRef.get(MongooseHealthIndicator),
      service: moduleRef.get(HealthCheckService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[check]', () => {
    it('[success] - should return app healthy', async () => {
      (context.others.service.check as jest.Mock).mockImplementationOnce(
        async (indicators) => {
          const results = await Promise.all(indicators.map((fn: any) => fn()));

          return {
            status: 'ok',
            details: results.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          };
        },
      );

      (context.others.mongo.pingCheck as jest.Mock).mockResolvedValueOnce({
        mongo: { status: 'up' },
      });

      expect(await context.controller.check()).toEqual({
        status: 'ok',
        details: { mongo: { status: 'up' } },
      });
    });
  });
});
