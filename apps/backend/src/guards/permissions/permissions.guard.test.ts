import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import {
  GuardMockProps,
  mockHelpers,
  MockMethodFactory,
} from '@shared/testing';
import { GROUPS_KEY, SCOPES_KEY } from '../../decorators';
import { LoggerProvider } from '../../providers';
import { PermissionGuard } from './permissions.guard';

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

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: {} },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
  });

  it('[no-user] - should handle an error when user is not defined', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: undefined },
    });

    mockContext.switchToHttp();

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      'User not found!',
    );
  });

  it('[no-values] - should return true when groups and scopes are not found', () => {
    (context.services.config.get as jest.Mock).mockReturnValue('PROD');
    (context.services.reflector.get as jest.Mock).mockReturnValue([]);

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: {} },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
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

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: { groups: ['VIEWER'], scopes: ['TRANSLATIONS'] } },
    });

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      'User does not have the required groups: ADMIN',
    );
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

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: { groups: ['VIEWER'] } },
    });

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      'User does not have the required scopes: TRANSLATIONS',
    );
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

    const { mockContext } = mockHelpers.guards.getMocks({
      req: { user: { groups: ['VIEWER'], scopes: ['PROJECTS'] } },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
  });
});
