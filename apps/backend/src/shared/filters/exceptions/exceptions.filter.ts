import { AppError } from '@/shared/core';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(AppError, HttpException)
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: AppError | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as any;

      return res.status(status).json({
        status,
        message: response.message || exception.message,
        referrer: `[${req.method.toUpperCase()}][default] - ${req.url}`,
      });
    }

    res.status(exception.status).json({
      status: exception.status,
      message: exception.message,
      referrer: `[${req.method.toUpperCase()}]${exception.referrer} - ${req.url}`,
    });
  }
}
