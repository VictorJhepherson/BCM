import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { UserPayload } from '@shared/models';
import { GuardMockProps, MockMethodFactory } from '@shared/testing';
import { GROUPS_KEY, SCOPES_KEY } from '../../decorators';
import { LoggerProvider } from '../../providers';
import { PermissionGuard } from './permissions.guard';

const getContext = (user: Partial<UserPayload> | undefined) =>
  ({
    getHandler: () => jest.fn(),
    switchToHttp: () => ({
      getNext: jest.fn(),
      getResponse: jest.fn(),
      getRequest: () => ({ user }),
    }),
  }) as unknown as ExecutionContext;

describe('[guards] - PermissionGuard', () => {
  const context = {} as GuardMockProps<
    PermissionGuard,
    { config: ConfigService; logger: LoggerProvider; reflector: Reflector }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: ConfigService,
          useFactory: () =>
            new MockMethodFactory<ConfigService>()
              .add('get', jest.fn())
              .build(),
        },
        {
          provide: Reflector,
          useFactory: () =>
            new MockMethodFactory<Reflector>().add('get', jest.fn()).build(),
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

    context.services = {
      reflector: moduleRef.get(Reflector),
      config: moduleRef.get(ConfigService),
      logger: moduleRef.get(LoggerProvider),
    };

    context.guard = moduleRef.get(PermissionGuard);
  });

  afterEach(() => jest.clearAllMocks());

  it('[by-pass] - should return true when environment is DEV', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('DEV');

    expect(context.guard.canActivate(getContext({}))).toBe(true);
  });

  it('[no-user] - should handle an error when user is not defined', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');

    expect(() => context.guard.canActivate(getContext(undefined))).toThrow(
      'User not found!',
    );
  });

  it('[no-values] - should return true when groups and scopes are not found', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');
    (context.services.reflector.get as jest.Mock).mockReturnValue([]);

    expect(context.guard.canActivate(getContext({}))).toBe(true);
  });

  it('[not-include] - should handle an error when group or scope are not found in user payload', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');
    (context.services.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['ADMIN'];
        if (key === SCOPES_KEY) return ['TRANSLATIONS'];

        return [];
      },
    );

    expect(() =>
      context.guard.canActivate(
        getContext({ groups: ['VIEWER'], scopes: ['TRANSLATIONS'] }),
      ),
    ).toThrow('User does not have the required groups: ADMIN');
  });

  it('[not-include] - should handle an error when group or scope is not present', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');
    (context.services.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['VIEWER'];
        if (key === SCOPES_KEY) return ['TRANSLATIONS'];

        return [];
      },
    );

    expect(() =>
      context.guard.canActivate(getContext({ groups: ['VIEWER'] })),
    ).toThrow('User does not have the required scopes: TRANSLATIONS');
  });

  it('[success] - should return true when user has permissions', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');
    (context.services.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['VIEWER'];
        if (key === SCOPES_KEY) return ['PROJECTS'];

        return [];
      },
    );

    expect(
      context.guard.canActivate(
        getContext({ groups: ['VIEWER'], scopes: ['PROJECTS'] }),
      ),
    ).toBe(true);
  });
});
