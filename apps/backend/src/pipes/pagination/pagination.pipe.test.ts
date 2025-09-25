import { mockData, PipeMockProps } from '@shared/testing';
import { PaginationPipe } from './pagination.pipe';

describe('[pipes] - PaginationPipe', () => {
  const context = {} as PipeMockProps<PaginationPipe>;

  beforeEach(() => {
    context.pipe = new PaginationPipe();
  });

  it('should return sort and pagination values', () => {
    const piped = context.pipe.transform({
      ...mockData.values.filter,
      enabled: true,
    });

    expect(piped).toStrictEqual({
      enabled: true,
      sort: mockData.values.filter.sort,
      pagination: mockData.values.filter.pagination,
    });
  });

  it('should return sort and pagination default values', () => {
    const piped = context.pipe.transform({ enabled: true });

    expect(piped).toStrictEqual({
      enabled: true,
      sort: mockData.values.filter.sort,
      pagination: mockData.values.filter.pagination,
    });
  });
});
