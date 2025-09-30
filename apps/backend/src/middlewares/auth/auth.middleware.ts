import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppError } from '@shared/core';
import { Environment, UserPayload } from '@shared/models';
import { NextFunction, Request, Response } from 'express';
import { LoggerProvider } from '../../providers';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, _: Response, next: NextFunction) {
    try {
      if (this.byPass()) return next();

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

      req.user = this.jwtService.verify<UserPayload>(token);
      return next();
    } catch (error) {
      throw AppError.handler(this.logger, {
        referrer: '[middleware][auth]',
        error,
      });
    }
  }

  private byPass(): boolean {
    return (
      this.configService.get<Environment>('ENVIRONMENT') === Environment.DEV
    );
  }
}
