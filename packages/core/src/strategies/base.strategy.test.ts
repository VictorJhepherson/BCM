import { BaseStrategy } from './base.strategy';

class TestMapper {
  mapTest(x: string) {
    return x.toLowerCase();
  }
}

class TestStrategy extends BaseStrategy<TestMapper> {
  constructor(mapper?: TestMapper) {
    super('[test]', mapper);
  }

  get(x: string) {
    return this.map({ key: 'mapTest', data: x });
  }

  async run<T>(fn: () => Promise<T>) {
    return this.execute(fn);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const strategy = new TestStrategy();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await strategy.run(mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(strategy.run(mockFn)).rejects.toEqual({
        referrer: '[test][strategy]',
        error: { success: false },
      });
    });
  });

  describe('[map]', () => {
    it('[success] - should map entity using provided mapper', () => {
      const service = new TestStrategy(new TestMapper());

      expect(service.get('TEST')).toEqual('test');
    });

    it('[failure] - should throw when mapper is not implemented', () => {
      const service = new TestStrategy();

      expect(() => service.get('TEST')).toThrow('Mapper not implemented!');
    });
  });
});
