import { TestLogger } from '@shared/testing';
import { BaseController } from './base.controller';

class TestController extends BaseController {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async run<T>(props: { fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - controller', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const controller = new TestController(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await controller.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(controller.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][controller]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
