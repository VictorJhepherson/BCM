import { TestLogger, TestMapper } from '@shared/testing';
import { BaseStrategy } from './base.strategy';

class TestStrategy extends BaseStrategy<TestMapper> {
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
    const strategy = new TestStrategy(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await strategy.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failure] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(strategy.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][strategy]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });

    describe('[map]', () => {
      const mockFn = jest.fn().mockResolvedValue({ value: 'TEST' });

      it('[success] - should map entity using provided mapper', async () => {
        const strategy = new TestStrategy(logger, mapper);

        const response = await strategy.run({ mapKey: 'mapTest', fn: mockFn });

        expect(mockFn).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalled();
        expect(response).toEqual('TEST');
      });

      it('[failure] - should throw when mapper is not implemented', async () => {
        const strategy = new TestStrategy(logger);

        await expect(
          strategy.run({ mapKey: 'mapTest', fn: mockFn }),
        ).rejects.toEqual({
          referrer: '[test][strategy]',
          error: expect.objectContaining({
            message: 'Mapper not implemented!',
          }),
        });

        expect(logger.error).toHaveBeenCalled();
      });
    });
  });
});
