import { MockMethodFactory, TMockPropsOf } from '@bcm/testing';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Request, Response } from 'express';
import { LoggerProvider } from '../../providers';
import { AuthMiddleware } from './auth.middleware';

const mocks = {
  next: jest.fn(),
  res: {} as Response,
  req: (headers = {}) => ({ headers }) as Request,
};

describe('[middlewares] - AuthMiddleware', () => {
  const context = {} as TMockPropsOf<
    'middleware',
    AuthMiddleware,
    {
      jwt: JwtService;
      logger: LoggerProvider;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthMiddleware,
        {
          provide: JwtService,
          useFactory: () =>
            new MockMethodFactory<JwtService>()
              .add('verify', jest.fn())
              .build(),
        },
        {
          provide: LoggerProvider,
          useFactory: () =>
            new MockMethodFactory<LoggerProvider>()
              .add('info', jest.fn())
              .add('warn', jest.fn())
              .add('error', jest.fn())
              .add('debug', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.middleware = moduleRef.get(AuthMiddleware);
    context.others = {
      jwt: moduleRef.get(JwtService),
      logger: moduleRef.get(LoggerProvider),
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('[no-auth] - should handle an error when authorization is not in headers', () => {
    expect(() =>
      context.middleware.use(mocks.req(), mocks.res, mocks.next),
    ).toThrow(
      expect.objectContaining({
        referrer: '[middleware][auth]',
        error: { message: 'Missing Authorization header' },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });

  it('[no-type] - should handle an error when authorization has no type', () => {
    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'token' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow(
      expect.objectContaining({
        referrer: '[middleware][auth]',
        error: { message: 'Invalid Authorization format' },
      }),
    );
  });

  it('[no-token] - should handle an error when authorization has no token', () => {
    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'Bearer' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow(
      expect.objectContaining({
        referrer: '[middleware][auth]',
        error: { message: 'Invalid Authorization format' },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });

  it('[success] - should call next when token is verified', () => {
    (context.others.jwt.verify as jest.Mock).mockReturnValue({ sub: '123' });

    context.middleware.use(
      mocks.req({ authorization: 'Bearer token' }),
      mocks.res,
      mocks.next,
    );

    expect(context.others.jwt.verify).toHaveBeenCalledWith('token');
  });

  it('[failure] - should handle an error when verify failure', () => {
    (context.others.jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid Token');
    });

    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'Bearer token' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow(
      expect.objectContaining({
        referrer: '[middleware][auth]',
        error: { message: 'Invalid Token' },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });
});
