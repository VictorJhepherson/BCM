import {
  mockHelpers,
  TestLogger,
  TestMapper,
  TMockPropsOf,
} from '@bcm/testing';

import { OperationBuilder } from './operations.builder';

const { mockConnection } = mockHelpers.database.getMocks();

const mockSuccessFn = jest.fn().mockResolvedValue({ response: 'MOCK_SUCCESS' });
const mockFailureFn = jest.fn().mockRejectedValue({ message: 'MOCK_FAILURE' });

describe('[builders] - OperationBuilder', () => {
  const context = {} as TMockPropsOf<
    'builder',
    OperationBuilder<string>,
    {
      logger: TestLogger;
      mapper: TestMapper;
    }
  >;

  beforeEach(() => {
    context.others = { logger: new TestLogger(), mapper: new TestMapper() };
    context.builder = new OperationBuilder<string>(context.others.logger, {
      referrer: '[referrer][test]',
    });
  });

  afterEach(() => jest.clearAllMocks());

  describe('[default]', () => {
    it('[success] - should call execute without any modification', async () => {
      const response = await context.builder.use(mockSuccessFn).execute();
      expect(response).toEqual({ response: 'MOCK_SUCCESS' });
    });

    it('[failure] - should call execute without any modification', async () => {
      await expect(
        context.builder.use(mockFailureFn).execute(),
      ).rejects.toMatchObject({
        referrer: '[referrer][test]',
        error: { message: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });

    it('[edge-case] - should call execute without any modification', async () => {
      await expect(context.builder.execute()).rejects.toMatchObject({
        referrer: '[referrer][test]',
        error: {
          message:
            'Executor function (fn) is missing. The builder was not properly configured using the .use() method.',
        },
      });
    });
  });

  describe('[useMapper]', () => {
    it('[success] - should call excute with mapper modification', async () => {
      const response = await context.builder
        .use(mockSuccessFn)
        .useMapper(context.others.mapper)
        .filter({ fn: (data) => data.toString().startsWith('MOCK') })
        .map({ key: 'mapTest' })
        .execute();

      expect(response).toEqual('MOCK_SUCCESS');
    });

    it('[failure] - should call execute with mapper modification', async () => {
      const promise = context.builder
        .use(mockFailureFn)
        .useMapper(context.others.mapper)
        .filter({ fn: (data) => data.toString().startsWith('MOCK') })
        .map({ key: 'mapTest' })
        .execute();

      await expect(promise).rejects.toMatchObject({
        referrer: '[referrer][test]',
        error: { message: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });
  });

  describe('[useConntection]', () => {
    it('[success] - should call execute with connection modification', async () => {
      const response = await context.builder
        .use(mockSuccessFn)
        .useConnection(mockConnection)
        .execute();

      expect(response).toEqual({ response: 'MOCK_SUCCESS' });
    });

    it('[failure] - should call execute with connection modification', async () => {
      const promise = context.builder
        .use(mockFailureFn)
        .useConnection(mockConnection)
        .execute();

      await expect(promise).rejects.toMatchObject({
        referrer: '[referrer][test]',
        error: { message: 'MOCK_FAILURE' },
      });

      expect(context.others.logger.error).toHaveBeenCalled();
    });
  });
});
