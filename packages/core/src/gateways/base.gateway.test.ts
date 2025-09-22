import { BaseGateway } from './base.gateway';

class TestGateway extends BaseGateway {
  constructor() {
    super('[test]');
  }

  async run<T>(fn: () => Promise<T>) {
    return this.execute(fn);
  }
}

describe('[base] - gateway', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const gateway = new TestGateway();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await gateway.run(mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(gateway.run(mockFn)).rejects.toEqual({
        referrer: '[test][gateway]',
        error: { success: false },
      });
    });
  });
});
