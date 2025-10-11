import { TContext } from '@/shared/models';
import { format } from '@bcm/helpers';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Context = createParamDecorator(
  (_, ctx: ExecutionContext): TContext => {
    const request: Request = ctx.switchToHttp().getRequest();

    const country = request.headers['country'] || 'US';
    const language = request.headers['language'] || 'en';

    const locale = `${language}-${country}`;

    return {
      user: request.user!,
      headers: request.headers,
      formatting: {
        date: format.date({ locale }),
        currency: format.currency({ locale }),
      },
    };
  },
);
