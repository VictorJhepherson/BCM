import { TBuilderOptions } from '@/helpers/builders/builders.mocks.types';
import { getMapBuilder } from '@/helpers/builders/mapper/mapper.mocks';

export const getOperationBuilder = <T>({
  response = { data: 'MOCK_RESPONSE' },
}: TBuilderOptions = {}): T => {
  return {
    use: jest.fn().mockReturnThis(),
    useConnection: jest.fn().mockReturnThis(),
    useMapper: jest.fn().mockImplementation(() => getMapBuilder({ response })),
    execute: jest.fn().mockImplementation(({ transformers }) => {
      if (!transformers?.length) return response;
      for (const transform of transformers) {
        response = transform(response);
      }

      return response;
    }),
  } as T;
};
