import { OperationBuilder } from '@/shared/core/builders';
import { TestLogger } from '@bcm/testing';

import { BaseService } from './base.service';

jest.mock('@/shared/core/builders', () => ({
  OperationBuilder: jest.fn().mockImplementation(() => {
    return {
      use: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({ success: true }),
      useMapper: jest.fn().mockReturnThis(),
    };
  }),
}));

class TestService extends BaseService {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async execute<T>(props: { fn: (builder: any) => Promise<T> }) {
    return this.run(props);
  }
}

describe('[base] - service', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const service = new TestService(logger);

    it('[success] - should call `run` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await service.execute({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `run` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(service.execute({ fn: mockFn })).rejects.toMatchObject({
        referrer: '[test][service]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('[with-builder] - should call `run` function successfully', async () => {
      const response = await service.execute({
        fn: (builder) => builder.use(jest.fn()).build(),
      });

      expect(response).toStrictEqual({ success: true });
      expect(OperationBuilder).toHaveBeenCalledWith(logger, {
        referrer: '[test][service]',
      });
    });
  });
});
