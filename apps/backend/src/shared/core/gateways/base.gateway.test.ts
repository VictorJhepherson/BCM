import { TestLogger } from '@bcm/testing';
import { BaseGateway } from './base.gateway';

class TestGateway extends BaseGateway {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async execute<T>(props: { fn: () => Promise<T> }) {
    return this.run(props);
  }
}

describe('[base] - gateway', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const gateway = new TestGateway(logger);

    it('[success] - should call `run` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await gateway.execute({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `run` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(gateway.execute({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][gateway]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
