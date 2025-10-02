import { ExecuteProps } from '@shared/models';
import { TestLogger } from '@shared/testing';
import { ExecutorBuilder } from '../builders/executor.builder';
import { BaseService } from './base.service';

jest.mock('../builders/executor.builder', () => ({
  ExecutorBuilder: jest.fn().mockImplementation(() => {
    return {
      use: jest.fn().mockReturnThis(),
      build: jest.fn().mockResolvedValue({ success: true }),
      withMapper: jest.fn().mockReturnThis(),
    };
  }),
}));

class TestService extends BaseService {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async run<T>(props: ExecuteProps<T, ExecutorBuilder<T>>) {
    return this.execute(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const service = new TestService(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await service.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(service.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][service]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    it('[with-builder] - should call `execute` function successfully', async () => {
      const response = await service.run({
        fn: (builder) => builder.use(jest.fn()).build(),
      });

      expect(response).toStrictEqual({ success: true });
      expect(ExecutorBuilder).toHaveBeenCalledWith(logger, {
        referrer: '[test][service]',
      });
    });
  });
});
