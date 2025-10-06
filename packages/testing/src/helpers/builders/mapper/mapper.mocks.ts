import { TBuilderOptions } from '@/helpers/builders/builders.mocks.types';
import { getOperationBuilder } from '@/helpers/builders/operation/operation.mocks';

export const getMapBuilder = <T>({
  response = { response: 'MOCK_RESPONSE' },
}: TBuilderOptions = {}): T => {
  const mockOperation = getOperationBuilder<any>({ response });

  return {
    map: jest.fn().mockImplementation(() => getMapBuilder({ response })),
    filter: jest.fn().mockImplementation(() => getMapBuilder({ response })),
    execute: jest
      .fn()
      .mockImplementation((options) => mockOperation.execute(options)),
  } as T;
};
