import { BaseStrategy } from './base.strategy';

class TestMapper {
  mapTest(data: Record<string, string>): string {
    return Object.values(data)[0] || '';
  }
}

class TestStrategy extends BaseStrategy<TestMapper> {
  constructor(mapper?: TestMapper) {
    super('[test]', mapper);
  }

  async run<T>(props: { mapKey?: string; fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const strategy = new TestStrategy();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await strategy.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failure] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(strategy.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][strategy]',
        error: { success: false },
      });
    });

    describe('[map]', () => {
      const mockFn = jest.fn().mockResolvedValue({ value: 'TEST' });

      it('[success] - should map entity using provided mapper', async () => {
        const strategy = new TestStrategy(new TestMapper());

        const response = await strategy.run({ mapKey: 'mapTest', fn: mockFn });

        expect(mockFn).toHaveBeenCalled();
        expect(response).toEqual('TEST');
      });

      it('[failure] - should throw when mapper is not implemented', async () => {
        const strategy = new TestStrategy();

        await expect(
          strategy.run({ mapKey: 'mapTest', fn: mockFn }),
        ).rejects.toEqual({
          referrer: '[test][strategy]',
          error: expect.objectContaining({
            message: 'Mapper not implemented!',
          }),
        });
      });
    });
  });
});
