import { TestLogger } from '@bcm/testing';
import { BaseStrategy } from './base.strategy';

class TestStrategy extends BaseStrategy {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async execute<T>(props: { fn: () => Promise<T> }) {
    return this.run(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const strategy = new TestStrategy(logger);

    it('[success] - should call `run` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await strategy.execute({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `run` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(strategy.execute({ fn: mockFn })).rejects.toMatchObject({
        referrer: '[test][strategy]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
