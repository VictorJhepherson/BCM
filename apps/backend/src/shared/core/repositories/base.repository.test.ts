import { TestLogger } from '@bcm/testing';
import { BaseRepository } from './base.repository';

class TestRepository extends BaseRepository {
  constructor(logger: TestLogger) {
    super('[test]', logger);
  }

  async execute<T>(props: { fn: () => Promise<T> }) {
    return this.run(props);
  }
}

describe('[base] - repository', () => {
  afterEach(() => jest.clearAllMocks());

  const logger = new TestLogger();

  describe('[execute]', () => {
    const repository = new TestRepository(logger);

    it('[success] - should call `run` function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue({ success: true });

      const response = await repository.execute({ fn: mockFn });

      expect(mockFn).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
      expect(response).toStrictEqual({ success: true });
    });

    it('[failed] - should call `run` function with failure', async () => {
      const mockFn = jest.fn().mockRejectedValue({ success: false });

      await expect(repository.execute({ fn: mockFn })).rejects.toEqual({
        referrer: '[test][repository]',
        error: { success: false },
      });

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
