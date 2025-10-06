import { AppError } from '@/shared/core';
import { LoggerProvider } from '@/shared/providers';

import { TUserPayload } from '@bcm/models';

import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly jwtService: JwtService,
  ) {}

  use(req: Request, _: Response, next: NextFunction) {
    try {
      const auth = req.headers['authorization'];
      if (!auth) {
        throw new UnauthorizedException({
          message: 'Missing Authorization header',
        });
      }

      const [type, token] = auth.split(' ');
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Invalid Authorization format',
        });
      }

      req.user = this.jwtService.verify<TUserPayload>(token);
      return next();
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: '[middleware][auth]',
        error,
      });
    }
  }
}
