import { BaseController } from './base.controller';

class TestLogger {
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  debug = jest.fn();
}

class TestController extends BaseController {
  constructor() {
    super('[test]', new TestLogger());
  }

  async run<T>(props: { fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - controller', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const controller = new TestController();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await controller.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(controller.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][controller]',
        error: { success: false },
      });
    });
  });
});
