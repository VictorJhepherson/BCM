import { OperationBuilder } from '@/shared/core/builders';
import {
  mockHelpers,
  TestMapper,
  TMockDataMap,
  TMockDataMaps,
} from '@bcm/testing';

import { MapBuilder } from './mappers.builder';

describe('[builders] - MapBuilder', () => {
  afterEach(() => jest.clearAllMocks());

  const mapper = new TestMapper();

  it('[build] - should call execute with empty transformers when no method is chained', async () => {
    const { mockOperation } =
      mockHelpers.builders.getMocks<OperationBuilder<string>>();

    const builder = new MapBuilder<string, TestMapper>(mapper, mockOperation);
    const response = await builder.execute();

    expect(response).toEqual({ data: 'MOCK_RESPONSE' });
    expect(mockOperation.execute).toHaveBeenCalledWith({
      transformers: [],
    });
  });

  describe('[filter]', () => {
    it('[item] - should call execute with filter transformer', async () => {
      const { mockOperation } =
        mockHelpers.builders.getMocks<OperationBuilder<TMockDataMap>>();

      const builder = new MapBuilder<TMockDataMap, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .filter({ fn: (response) => response.data.includes('MOCK_RESPONSE') })
        .execute();

      expect(response).toEqual({ data: 'MOCK_RESPONSE' });
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[item] - should call execute with filter transformer and select response', async () => {
      const { mockOperation } =
        mockHelpers.builders.getMocks<OperationBuilder<TMockDataMap>>();

      const builder = new MapBuilder<TMockDataMap, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .filter({
          select: 'response',
          fn: (data) => data.includes('MOCK_RESPONSE'),
        })
        .execute();

      expect(response).toEqual({ data: 'MOCK_RESPONSE' });
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[object] - should call execute with filter transformer', async () => {
      const { mockOperation } = mockHelpers.builders.getMocks<
        OperationBuilder<TMockDataMaps>
      >({
        operation: {
          response: {
            data: [{ response: 'MOCK_RESPONSE' }, { response: 'RESPONSE' }],
          },
        },
      });

      const builder = new MapBuilder<TMockDataMaps, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .filter({ fn: ({ data }) => data.length > 0 })
        .execute();

      expect(response).toEqual({
        data: [{ response: 'MOCK_RESPONSE' }, { response: 'RESPONSE' }],
      });

      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[object] - should call execute with filter transformer and select data', async () => {
      const { mockOperation } = mockHelpers.builders.getMocks<
        OperationBuilder<TMockDataMaps>
      >({
        operation: {
          response: {
            data: [{ response: 'MOCK_RESPONSE' }, { response: 'RESPONSE' }],
          },
        },
      });

      const builder = new MapBuilder<TMockDataMaps, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .filter({
          select: 'data',
          fn: (data) => data.response.includes('MOCK_RESPONSE'),
        })
        .execute();

      expect(response).toEqual({ data: [{ response: 'MOCK_RESPONSE' }] });
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[array] - should call execute with filter transformer', async () => {
      const { mockOperation } = mockHelpers.builders.getMocks<
        OperationBuilder<string[]>
      >({
        operation: {
          response: ['MOCK_RESPONSE', 'RESPONSE'],
        },
      });

      const builder = new MapBuilder<string[], TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .filter({
          fn: (data) => data.includes('MOCK_'),
        })
        .execute();

      expect(response).toEqual(['MOCK_RESPONSE']);
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });
  });

  describe('[map]', () => {
    it('[mapTest] - should call execute with map transformer', async () => {
      const { mockOperation } =
        mockHelpers.builders.getMocks<OperationBuilder<TMockDataMap>>();

      const builder = new MapBuilder<TMockDataMap, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder.map({ key: 'mapTest' }).execute();

      expect(response).toEqual('MOCK_RESPONSE');
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[mapTests] - should call execute with map transformer', async () => {
      const { mockOperation } = mockHelpers.builders.getMocks<
        OperationBuilder<TMockDataMaps>
      >({
        operation: { response: { data: [{ response: 'MOCK_RESPONSE' }] } },
      });

      const builder = new MapBuilder<TMockDataMaps, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder.map({ key: 'mapTests' }).execute();

      expect(response).toEqual(['MOCK_RESPONSE']);
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });

    it('[mapValues] - should call execute with map transformer and select data', async () => {
      const { mockOperation } = mockHelpers.builders.getMocks<
        OperationBuilder<TMockDataMaps>
      >({
        operation: { response: { data: [{ response: 'MOCK_RESPONSE' }] } },
      });

      const builder = new MapBuilder<TMockDataMaps, TestMapper>(
        mapper,
        mockOperation,
      );

      const response = await builder
        .map({ select: 'data', key: 'mapValues' })
        .execute();

      expect(response).toEqual({ data: ['MOCK_RESPONSE'] });
      expect(mockOperation.execute).toHaveBeenCalledWith({
        transformers: expect.arrayContaining([expect.any(Function)]),
      });
    });
  });
});
