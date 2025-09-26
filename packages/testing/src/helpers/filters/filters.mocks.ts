import { getArgumentsHost } from '../common/common.mocks';
import { Options } from '../common/common.mocks.types';
import { FilterMock } from './filters.mocks.types';

const getMocks = ({
  req = { method: 'get', url: '/test' },
  res,
}: Options = {}): FilterMock => {
  const mockJson = jest.fn();
  const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

  const mockHost = getArgumentsHost({
    req,
    res: { status: mockStatus, ...res },
  });

  return { mockHost, mockStatus, mockJson };
};

export const filters = { getMocks } as const;
export type MockFilterType = typeof filters;
