import { mockHelpers } from '@bcm/testing';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Payload } from './payload.decorator';

export const getFactory = (decorator: Function) => {
  class TestDecorator {
    run(@decorator() value: { active: boolean }) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'run');
  return args[Object.keys(args)[0]].factory;
};

describe('[decorators] - @Payload', () => {
  it('should extract and return the request body as payload', () => {
    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { body: { active: true } },
    });

    const factory = getFactory(Payload);
    const metadata = factory(null, mockContext);

    expect(metadata).toEqual({ active: true });
  });
});
