import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { Test } from '@nestjs/testing';
import { MockControllerProps, MockFactory } from '@shared/testing';
import { HealthController } from './health.controller';

const mockCheck = jest.fn().mockImplementation(async (indicators) => {
  const results = await Promise.all(indicators.map((fn) => fn()));

  return {
    status: 'ok',
    details: results.reduce((acc, cur) => ({ ...acc, ...cur }), {}),
  };
});

const mockPingCheck = jest.fn().mockResolvedValue({
  mongo: { status: 'up' },
});

describe('[controllers] - HealthController', () => {
  const context = {} as MockControllerProps<
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
            new MockFactory<HealthCheckService>()
              .addMethod('check', mockCheck)
              .createMock(),
        },
        {
          provide: MongooseHealthIndicator,
          useFactory: () =>
            new MockFactory<MongooseHealthIndicator>()
              .addMethod('pingCheck', mockPingCheck)
              .createMock(),
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
      expect(await context.controller.check()).toEqual({
        status: 'ok',
        details: { mongo: { status: 'up' } },
      });
    });
  });
});
