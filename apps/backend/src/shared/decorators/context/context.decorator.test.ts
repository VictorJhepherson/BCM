import { TContext } from '@/shared/models';
import { mockData, mockHelpers } from '@bcm/testing';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { format } from '@bcm/helpers';
import { Context } from './context.decorator';

jest.mock('@bcm/helpers', () => ({
  format: {
    date: jest.fn().mockImplementation(() => jest.fn()),
    currency: jest.fn().mockImplementation(() => jest.fn()),
  },
}));

export const getFactory = (decorator: Function) => {
  class TestDecorator {
    run(@decorator() _: TContext) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'run');
  return args[Object.keys(args)[0]].factory;
};

describe('[decorators] - @Context', () => {
  afterEach(() => jest.clearAllMocks());

  it('should extract and return the request user, headers and formatting as context', () => {
    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: mockData.user, headers: mockData.headers },
    });

    const factory = getFactory(Context);
    const metadata = factory(null, mockContext);

    expect(metadata).toEqual({
      user: mockData.user,
      headers: mockData.headers,
      formatting: {
        date: expect.any(Function),
        currency: expect.any(Function),
      },
    });

    expect(format.date).toHaveBeenCalledWith({ locale: 'en-US' });
  });

  it('should extract and return the request user, headers and formatting with default locale as context', () => {
    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: {
        user: mockData.user,
        headers: {
          ...mockData.headers,
          country: undefined,
          language: undefined,
        },
      },
    });

    const factory = getFactory(Context);
    const metadata = factory(null, mockContext);

    expect(metadata).toEqual({
      user: mockData.user,
      headers: { ...mockData.headers, country: undefined, language: undefined },
      formatting: {
        date: expect.any(Function),
        currency: expect.any(Function),
      },
    });

    expect(format.date).toHaveBeenCalledWith({ locale: 'en-US' });
  });
});
