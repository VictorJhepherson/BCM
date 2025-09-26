import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AppError } from '@shared/core';
import { Environment, UserPayload } from '@shared/models';
import { GROUPS_KEY, SCOPES_KEY } from '../../decorators';
import { LoggerProvider } from '../../providers';
import { PermissionOptions } from './permissions.guard.types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (this.byPass()) return true;

      const req = context.switchToHttp().getRequest();
      const user: UserPayload | undefined = req.user;

      if (!user) {
        throw new ForbiddenException({
          message: 'User not found!',
        });
      }

      this.validate(GROUPS_KEY, { user, handler: context.getHandler() });
      this.validate(SCOPES_KEY, { user, handler: context.getHandler() });
      return true;
    } catch (error) {
      throw AppError.handler({
        referrer: '[guard][permission]',
        error,
        logger: this.logger,
      });
    }
  }

  private byPass(): boolean {
    return (
      this.configService.get<Environment>('ENVIRONMENT') === Environment.DEV
    );
  }

  private validate(key: string, { user, handler }: PermissionOptions): void {
    const required = this.reflector.get<string[]>(key, handler);
    if (!required.length) return;

    if (!required.some((item) => (user[key] || []).includes(item))) {
      throw new ForbiddenException({
        message: `User does not have the required ${key}: ${required.join(', ')}`,
      });
    }
  }
}
