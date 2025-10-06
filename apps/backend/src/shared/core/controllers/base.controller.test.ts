import { TestLogger } from '@bcm/testing';
import { BaseController } from './base.controller';

class TestController extends BaseController {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async execute<T>(props: { fn: () => Promise<T> }) {
    return this.run(props);
  }
}

describe('[base] - controller', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const controller = new TestController(logger);

    it('[success] - should call `run` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await controller.execute({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `run` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(controller.execute({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][controller]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
