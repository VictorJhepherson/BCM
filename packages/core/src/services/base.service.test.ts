import { TestLogger, TestMapper } from '@shared/testing';
import { BaseService } from './base.service';

class TestService extends BaseService<TestMapper> {
  constructor(logger: TestLogger, mapper?: TestMapper) {
    super('[test]', logger, mapper);
  }

  async run<T>(props: { mapKey?: string; fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();
  const mapper = new TestMapper();

  describe('[execute]', () => {
    const service = new TestService(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await service.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failure] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(service.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][service]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    describe('[map]', () => {
      const mockFn = jest.fn().mockResolvedValue({ value: 'TEST' });

      it('[success] - should map entity using provided mapper', async () => {
        const service = new TestService(logger, mapper);

        const response = await service.run({ mapKey: 'mapTest', fn: mockFn });

        expect(mockFn).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalled();

        expect(response).toEqual('TEST');
      });

      it('[failure] - should throw when mapper is not implemented', async () => {
        const service = new TestService(logger);

        await expect(
          service.run({ mapKey: 'mapTest', fn: mockFn }),
        ).rejects.toEqual({
          referrer: '[test][service]',
          error: expect.objectContaining({
            message: 'Mapper not implemented!',
          }),
        });
      });
    });
  });
});
