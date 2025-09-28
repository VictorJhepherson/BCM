import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { MockMethodFactory, MockPropsOf } from '@shared/testing';
import { Request, Response } from 'express';
import { LoggerProvider } from '../../providers';
import { AuthMiddleware } from './auth.middleware';

const mocks = {
  next: jest.fn(),
  res: {} as Response,
  req: (headers = {}) => ({ headers }) as Request,
};

describe('[middlewares] - AuthMiddleware', () => {
  const context = {} as MockPropsOf<
    'middleware',
    AuthMiddleware,
    {
      jwt: JwtService;
      config: ConfigService;
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
        {
          provide: ConfigService,
          useFactory: () =>
            new MockMethodFactory<ConfigService>()
              .add('get', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.middleware = moduleRef.get(AuthMiddleware);
    context.others = {
      jwt: moduleRef.get(JwtService),
      config: moduleRef.get(ConfigService),
      logger: moduleRef.get(LoggerProvider),
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('[by-pass] - should call next when environment is DEV', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('DEV');

    context.middleware.use(mocks.req(), mocks.res, mocks.next);
    expect(mocks.next).toHaveBeenCalled();
  });

  it('[no-auth] - should handle an error when authorization is not in headers', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('PROD');

    expect(() =>
      context.middleware.use(mocks.req(), mocks.res, mocks.next),
    ).toThrow('Missing Authorization header');
  });

  it('[no-type] - should handle an error when authorization has no type', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('PROD');

    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'token' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow('Invalid Authorization format');
  });

  it('[no-token] - should handle an error when authorization has no token', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('PROD');

    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'Bearer' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow('Invalid Authorization format');
  });

  it('[success] - should call next when token is verified', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('PROD');
    (context.others.jwt.verify as jest.Mock).mockReturnValue({ sub: '123' });

    context.middleware.use(
      mocks.req({ authorization: 'Bearer token' }),
      mocks.res,
      mocks.next,
    );

    expect(context.others.jwt.verify).toHaveBeenCalledWith('token');
  });

  it('[failure] - should handle an error when verify failure', () => {
    (context.others.config.get as jest.Mock).mockReturnValue('PROD');
    (context.others.jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid Token');
    });

    expect(() =>
      context.middleware.use(
        mocks.req({ authorization: 'Bearer token' }),
        mocks.res,
        mocks.next,
      ),
    ).toThrow('Invalid Token');
  });
});
