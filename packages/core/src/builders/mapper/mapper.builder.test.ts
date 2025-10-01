import { mockHelpers, TestMapper } from '@shared/testing';
import { ExecutorBuilder } from '../executor.builder';
import { MapBuilder } from './mapper.builder';

describe('[builders] - MapBuilder', () => {
  afterEach(() => jest.clearAllMocks());

  const mapper = new TestMapper();

  it('[build] - should call build with empty transformers when no method is chained', async () => {
    const { mockExecutor } =
      mockHelpers.builders.getMocks<ExecutorBuilder<string>>();

    const builder = new MapBuilder<string, TestMapper>(mapper, mockExecutor);
    const response = await builder.build();

    expect(response).toEqual({ response: 'MOCK_RESPONSE' });
    expect(mockExecutor.build).toHaveBeenCalledWith({
      transformers: [],
    });
  });

  describe('[filter]', () => {
    it('[item] - should call build with filter transformer', async () => {
      const { mockExecutor } =
        mockHelpers.builders.getMocks<
          ExecutorBuilder<Record<string, string>>
        >();

      const builder = new MapBuilder<Record<string, string>, TestMapper>(
        mapper,
        mockExecutor,
      );

      const response = await builder
        .filter((data) => data.response.includes('MOCK_RESPONSE'))
        .build();

      expect(response).toEqual({ response: 'MOCK_RESPONSE' });
      expect(mockExecutor.build).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[array-of-item] - should call build with filter transformer', async () => {
      const { mockExecutor } = mockHelpers.builders.getMocks<
        ExecutorBuilder<Record<string, string>[]>
      >({
        executor: {
          data: [{ response: 'MOCK_RESPONSE' }, { response: 'RESPONSE' }],
        },
      });

      const builder = new MapBuilder<Record<string, string>[], TestMapper>(
        mapper,
        mockExecutor,
      );

      const response = await builder
        .filter((data) => data.response.includes('MOCK_RESPONSE'))
        .build();

      expect(response).toEqual([{ response: 'MOCK_RESPONSE' }]);
      expect(mockExecutor.build).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });
  });

  describe('[map]', () => {
    it('[mapTest] - should call build with map transformer', async () => {
      const { mockExecutor } =
        mockHelpers.builders.getMocks<ExecutorBuilder<string>>();

      const builder = new MapBuilder<string, TestMapper>(mapper, mockExecutor);
      const response = await builder.map({ key: 'mapTest' }).build();

      expect(response).toEqual('MOCK_RESPONSE');
      expect(mockExecutor.build).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[mapTests] - should call build with map transformer', async () => {
      const { mockExecutor } = mockHelpers.builders.getMocks<
        ExecutorBuilder<string[]>
      >({
        executor: { data: [{ response: 'MOCK_RESPONSE' }] },
      });

      const builder = new MapBuilder<string[], TestMapper>(
        mapper,
        mockExecutor,
      );

      const response = await builder.map({ key: 'mapTests' }).build();

      expect(response).toEqual(['MOCK_RESPONSE']);
      expect(mockExecutor.build).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });
  });
});
