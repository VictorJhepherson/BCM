import {
  mockHelpers,
  MockPropsOf,
  TestLogger,
  TestMapper,
} from '@shared/testing';
import { ExecutorBuilder } from './executor.builder';

const { mockConnection } = mockHelpers.mongo.getMocks();

const mockSuccessFn = jest.fn().mockResolvedValue({ response: 'MOCK_SUCCESS' });
const mockFailureFn = jest.fn().mockRejectedValue({ response: 'MOCK_FAILURE' });

describe('[builders] - ExecutorBuilder', () => {
  const context = {} as MockPropsOf<
    'builder',
    ExecutorBuilder<string>,
    {
      logger: TestLogger;
      mapper: TestMapper;
    }
  >;

  beforeEach(() => {
    context.others = { logger: new TestLogger(), mapper: new TestMapper() };
    context.builder = new ExecutorBuilder(context.others.logger, {
      referrer: '[referrer][test]',
    });
  });

  afterEach(() => jest.clearAllMocks());

  describe('[default]', () => {
    it('[success] - should call build without any modification', async () => {
      const response = await context.builder.use(mockSuccessFn).build();
      expect(response).toEqual({ response: 'MOCK_SUCCESS' });
    });

    it('[failure] - should call build without any modification', async () => {
      await expect(context.builder.use(mockFailureFn).build()).rejects.toEqual({
        referrer: '[referrer][test]',
        error: { response: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });

    it('[edge-case] - should call build without any modification', async () => {
      await expect(context.builder.build()).rejects.toEqual({
        referrer: '[referrer][test]',
        error: {
          message:
            'Executor function (fn) is missing. The builder was not properly configured using the .use() method.',
        },
      });
    });
  });

  describe('[withMapper]', () => {
    it('[success] - should call build with mapper modification', async () => {
      const response = await context.builder
        .use(mockSuccessFn)
        .withMapper(context.others.mapper)
        .filter((data) => data.startsWith('MOCK'))
        .map({ key: 'mapTest' })
        .build();

      expect(response).toEqual('MOCK_SUCCESS');
    });

    it('[failure] - should call build with mapper modification', async () => {
      const promise = context.builder
        .use(mockFailureFn)
        .withMapper(context.others.mapper)
        .filter((data) => data.startsWith('MOCK'))
        .map({ key: 'mapTest' })
        .build();

      await expect(promise).rejects.toEqual({
        referrer: '[referrer][test]',
        error: { response: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });
  });

  describe('[withConnection]', () => {
    it('[success] - should call build with mapper modification', async () => {
      const response = await context.builder
        .use(mockSuccessFn)
        .withConnection(mockConnection)
        .build();

      expect(response).toEqual({ response: 'MOCK_SUCCESS' });
    });

    it('[failure] - should call build with mapper modification', async () => {
      const promise = context.builder
        .use(mockFailureFn)
        .withConnection(mockConnection)
        .build();

      await expect(promise).rejects.toEqual({
        referrer: '[referrer][test]',
        error: { response: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });
  });
});
