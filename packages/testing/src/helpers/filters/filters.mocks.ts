import { ArgumentsHost } from '@nestjs/common';
import { FilterMock, Options } from './filters.mocks.types';

const getMocks = ({
  request = { method: 'get', url: '/test' },
  response,
}: Options = {}): FilterMock => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  const mockHost = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(request),
      getResponse: jest
        .fn()
        .mockReturnValue({ status: mockStatus, ...response }),
    }),
  } as unknown as ArgumentsHost;

  return { mockHost, mockStatus, mockJson };
};

export const filters = { getMocks } as const;
export type MockFilterType = typeof filters;
