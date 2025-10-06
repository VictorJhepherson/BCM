import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Payload = createParamDecorator((_, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return { ...request.body };
});
