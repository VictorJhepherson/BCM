import { BaseController } from './base.controller';

class TestController extends BaseController {
  constructor() {
    super('[test]');
  }

  async run<T>(fn: () => Promise<T>) {
    return this.execute(fn);
  }
}

describe('[base] - controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const controller = new TestController();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await controller.run(mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(controller.run(mockFn)).rejects.toEqual({
        referrer: '[test][controller]',
        error: { success: false },
      });
    });
  });
});
