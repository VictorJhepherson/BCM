import { GROUPS_KEY, SCOPES_KEY } from '@/shared/decorators';
import { LoggerProvider } from '@/shared/providers';

import { mockHelpers, MockMethodFactory, TMockPropsOf } from '@bcm/testing';

import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { PermissionGuard } from './permissions.guard';

describe('[guards] - PermissionGuard', () => {
  const context = {} as TMockPropsOf<
    'guard',
    PermissionGuard,
    {
      reflector: Reflector;
      logger: LoggerProvider;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: Reflector,
          useFactory: () =>
            new MockMethodFactory<Reflector>()
              .add('get', jest.fn())
              .add('getAllAndOverride', jest.fn())
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

    context.guard = moduleRef.get(PermissionGuard);
    context.others = {
      reflector: moduleRef.get(Reflector),
      logger: moduleRef.get(LoggerProvider),
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('[by-pass] - should return true when environment is DEV', () => {
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      true,
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: {} },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
  });

  it('[no-user] - should handle an error when user is not defined', () => {
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      false,
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: undefined },
    });

    mockContext.switchToHttp();

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      expect.objectContaining({
        referrer: '[guard][permission]',
        error: { message: 'User not found' },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });

  it('[no-values] - should return true when groups and scopes are not found', () => {
    (context.others.reflector.get as jest.Mock).mockReturnValue([]);
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      false,
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: {} },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
  });

  it('[not-include] - should handle an error when group or scope are not found in user payload', () => {
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      false,
    );

    (context.others.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['ADMIN'];
        if (key === SCOPES_KEY) return ['TRANSLATIONS'];

        return [];
      },
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: { groups: ['VIEWER'], scopes: ['TRANSLATIONS'] } },
    });

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      expect.objectContaining({
        referrer: '[guard][permission]',
        error: { message: 'User does not have the required groups: ADMIN' },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });

  it('[not-include] - should handle an error when group or scope is not present', () => {
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      false,
    );

    (context.others.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['VIEWER'];
        if (key === SCOPES_KEY) return ['TRANSLATIONS'];

        return [];
      },
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: { groups: ['VIEWER'] } },
    });

    expect(() => context.guard.canActivate(mockContext)).toThrow(
      expect.objectContaining({
        referrer: '[guard][permission]',
        error: {
          message: 'User does not have the required scopes: TRANSLATIONS',
        },
      }),
    );

    expect(context.others.logger.error).toHaveBeenCalled();
  });

  it('[success] - should return true when user has permissions', () => {
    (context.others.reflector.getAllAndOverride as jest.Mock).mockReturnValue(
      false,
    );

    (context.others.reflector.get as jest.Mock).mockImplementation(
      (key: string) => {
        if (key === GROUPS_KEY) return ['VIEWER'];
        if (key === SCOPES_KEY) return ['PROJECTS'];

        return [];
      },
    );

    const { mockContext } = mockHelpers.nestjs.getMocks({
      req: { user: { groups: ['VIEWER'], scopes: ['PROJECTS'] } },
    });

    expect(context.guard.canActivate(mockContext)).toBe(true);
  });
});
