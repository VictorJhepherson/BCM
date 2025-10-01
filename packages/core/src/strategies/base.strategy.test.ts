import { TestLogger } from '@shared/testing';
import { BaseStrategy } from './base.strategy';

class TestStrategy extends BaseStrategy {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async run<T>(props: { fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const strategy = new TestStrategy(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await strategy.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
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
  });
});
