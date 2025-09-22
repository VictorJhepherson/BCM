import { BaseService } from './base.service';

class TestMapper {
  mapTest(x: string) {
    return x.toLowerCase();
  }
}

class TestService extends BaseService<TestMapper> {
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

describe('[base] - service', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const service = new TestService();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await service.run(mockFn);

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(service.run(mockFn)).rejects.toEqual({
        referrer: '[test][service]',
        error: { success: false },
      });
    });
  });

  describe('[map]', () => {
    it('[success] - should map entity using provided mapper', () => {
      const service = new TestService(new TestMapper());

      expect(service.get('TEST')).toEqual('test');
    });

    it('[failure] - should throw when mapper is not implemented', () => {
      const service = new TestService();

      expect(() => service.get('TEST')).toThrow('Mapper not implemented!');
    });
  });
});
