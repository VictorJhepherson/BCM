import { BaseGateway } from './base.gateway';

class TestGateway extends BaseGateway {
  constructor() {
    super('[test]');
  }

  async run<T>(props: { fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - gateway', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const gateway = new TestGateway();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await gateway.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(gateway.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][gateway]',
        error: { success: false },
      });
    });
  });
});
