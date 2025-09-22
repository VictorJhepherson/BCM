import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AppError } from './errors.model';

describe('[model] - AppError', () => {
  const referrer = '[context][layer]';

  describe('[constructor]', () => {
    it('[default] - should set properties when error is generic Error', () => {
      const appError = new AppError({
        referrer,
        error: new Error('generic failure'),
      });

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.referrer).toBe(referrer);
      expect(appError.message).toBe('generic failure');
      expect(appError.status).toBe(500);
    });

    it('[http-exception] - should set properties when error is HttpException', () => {
      const appError = new AppError({
        referrer,
        error: new NotFoundException('not found!'),
      });

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.referrer).toBe(referrer);
      expect(appError.message).toBe('not found!');
      expect(appError.status).toBe(404);
    });

    it('[unknown] - should set properties when error is unknown', () => {
      const appError = new AppError({
        referrer,
        error: {} as unknown,
      });

      expect(appError).toBeInstanceOf(AppError);
      expect(appError.referrer).toBe(referrer);
      expect(appError.message).toBe('Internal Server Error');
      expect(appError.status).toBe(500);
    });
  });

  describe('[handler]', () => {
    const error = new Error('generic failure');

    it('[default] - should throw AppError when receiving a generic Error', () => {
      const mockFn = () => AppError.handler({ referrer, error });

      expect(mockFn).toThrow(AppError);
      expect(mockFn).toThrow('generic failure');
    });

    it('[http-exception] - should throw AppError when receiving an HttpException', () => {
      const mockFn = () =>
        AppError.handler({
          referrer,
          error: new BadRequestException({ message: 'bad request' }),
        });

      expect(mockFn).toThrow(AppError);
      expect(mockFn).toThrow('bad request');
    });

    it('[app-error] - should throw AppError when receiving an AppError', () => {
      const mockFn = () =>
        AppError.handler({
          referrer,
          error: new AppError({ referrer, error }),
        });

      expect(mockFn).toThrow(AppError);
      expect(mockFn).toThrow('generic failure');
    });
  });
});
