import { mockHelpers } from '@bcm/testing';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Filter } from './filter.decorator';

export const getFactory = (decorator: Function) => {
  class TestDecorator {
    run(@decorator() value: { _id: string; page: string }) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'run');
  return args[Object.keys(args)[0]].factory;
};

describe('[decorators] - @Filter', () => {
  it('should extract and return the request params and query as filter', () => {
    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { params: { _id: '_id' }, query: { page: '1' } },
    });

    const factory = getFactory(Filter);
    const metadata = factory(null, mockContext);

    expect(metadata).toEqual({ _id: '_id', page: '1' });
  });
});
