import { TestLogger } from '@shared/testing';
import { BaseRepository } from './base.repository';

class TestRepository extends BaseRepository {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async run<T>(props: { fn: () => Promise<T> }) {
    return this.execute(props);
  }
}

describe('[base] - repository', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const repository = new TestRepository(logger);

    it('[success] - should call `execute` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await repository.run({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.debug).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `execute` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(repository.run({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][repository]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
