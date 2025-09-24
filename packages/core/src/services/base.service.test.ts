import { BaseService } from './base.service';

class TestLogger {
  info = jest.fn();
  warn = jest.fn();
  error = jest.fn();
  debug = jest.fn();
}

class TestMapper {
  mapTest(data: Record<string, string>): string {
    return Object.values(data)[0] || '';
  }
}

class TestService extends BaseService<TestMapper> {
  constructor(mapper?: TestMapper) {
    super('[test]', new TestLogger(), mapper);
  }

  async run<T>(props: { mapKey?: string; fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - strategy', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[execute]', () => {
    const service = new TestService();

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await service.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failure] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(service.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][service]',
        error: { success: false },
      });
    });

    describe('[map]', () => {
      const mockFn = jest.fn().mockResolvedValue({ value: 'TEST' });

      it('[success] - should map entity using provided mapper', async () => {
        const service = new TestService(new TestMapper());

        const response = await service.run({ mapKey: 'mapTest', fn: mockFn });

        expect(mockFn).toHaveBeenCalled();
        expect(response).toEqual('TEST');
      });

      it('[failure] - should throw when mapper is not implemented', async () => {
        const service = new TestService();

        await expect(
          service.run({ mapKey: 'mapTest', fn: mockFn }),
        ).rejects.toEqual({
          referrer: '[test][service]',
          error: expect.objectContaining({
            message: 'Mapper not implemented!',
          }),
        });
      });
    });
  });
});
