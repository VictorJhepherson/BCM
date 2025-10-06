import { AppError } from '@/shared/core';
import { BY_PASS_KEY, GROUPS_KEY, SCOPES_KEY } from '@/shared/decorators';
import { LoggerProvider } from '@/shared/providers';

import { TUserPayload } from '@bcm/models';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TPermissionOptions } from './permissions.guard.types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (this.byPass(context)) return true;

      const req = context.switchToHttp().getRequest();
      const user: TUserPayload | undefined = req.user;

      if (!user) {
        throw new ForbiddenException({
          message: 'User not found',
        });
      }

      this.validate(GROUPS_KEY, { user, handler: context.getHandler() });
      this.validate(SCOPES_KEY, { user, handler: context.getHandler() });
      return true;
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: '[guard][permission]',
        error,
      });
    }
  }

  private byPass(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(BY_PASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private validate(key: string, { user, handler }: TPermissionOptions): void {
    const required = this.reflector.get<string[]>(key, handler);
    if (!required.length) return;

    if (!required.some((item) => (user[key] || []).includes(item))) {
      throw new ForbiddenException({
        message: `User does not have the required ${key}: ${required.join(', ')}`,
      });
    }
  }
}
