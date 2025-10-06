import { mockData, TMockPropsOf } from '@bcm/testing';
import { PaginationPipe } from './pagination.pipe';

describe('[pipes] - PaginationPipe', () => {
  const context = {} as TMockPropsOf<'pipe', PaginationPipe>;

  beforeEach(() => {
    context.pipe = new PaginationPipe();
  });

  it('should return sort and pagination values', () => {
    const piped = context.pipe.transform({
      ...mockData.filter,
      enabled: true,
    });

    expect(piped).toStrictEqual({
      enabled: true,
      sort: mockData.filter.sort,
      pagination: mockData.filter.pagination,
    });
  });

  it('should return sort and pagination default values', () => {
    const piped = context.pipe.transform({ enabled: true });

    expect(piped).toStrictEqual({
      enabled: true,
      sort: mockData.filter.sort,
      pagination: mockData.filter.pagination,
    });
  });
});
