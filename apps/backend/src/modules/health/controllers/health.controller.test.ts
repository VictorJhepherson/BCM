import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { ControllerMockProps, MockMethodFactory } from '@shared/testing';
import { HealthController } from './health.controller';

describe('[controllers] - HealthController', () => {
  const context = {} as ControllerMockProps<
    HealthController,
    HealthCheckService,
    { mongo: MongooseHealthIndicator }
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

    context.service = moduleRef.get(HealthCheckService);
    context.providers = {
      mongo: moduleRef.get(MongooseHealthIndicator),
    };

    context.controller = moduleRef.get(HealthController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[check]', () => {
    it('[success] - should return app healthy', async () => {
      (context.service.check as jest.Mock).mockImplementationOnce(
        async (indicators) => {
          const results = await Promise.all(indicators.map((fn) => fn()));

          return {
            status: 'ok',
            details: results.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
          };
        },
      );

      (context.providers.mongo.pingCheck as jest.Mock).mockResolvedValueOnce({
        mongo: { status: 'up' },
      });

      expect(await context.controller.check()).toEqual({
        status: 'ok',
        details: { mongo: { status: 'up' } },
      });
    });
  });
});
