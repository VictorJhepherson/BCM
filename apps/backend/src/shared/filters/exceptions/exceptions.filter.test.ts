import { AppError } from '@/shared/core/exceptions/base.exception';
import { mockHelpers } from '@bcm/testing';

import { HttpException } from '@nestjs/common';

import { AppErrorFilter } from './exceptions.filter';

describe('[filters] - AppErrorFilter', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[catch]', () => {
    const filter = new AppErrorFilter();

    it('[app-error] - should handle the error correctly', () => {
      const { mockHost } = mockHelpers.nestjs.getMocks();

      const exception = new AppError({
        referrer: '[custom]',
        error: new Error('ERROR TEST'),
      });

      filter.catch(exception, mockHost.arguments);

      expect(mockHost.status).toHaveBeenCalledWith(500);
      expect(mockHost.json).toHaveBeenCalledWith({
        status: 500,
        message: 'ERROR TEST',
        referrer: '[GET][custom] - /test',
      });
    });

    it('[http-exception] - should handle the error correctly', () => {
      const { mockHost } = mockHelpers.nestjs.getMocks();

      const exception = new HttpException({ message: 'ERROR TEST' }, 400);

      filter.catch(exception, mockHost.arguments);

      expect(mockHost.status).toHaveBeenCalledWith(400);
      expect(mockHost.json).toHaveBeenCalledWith({
        status: 400,
        message: 'ERROR TEST',
        referrer: '[GET][default] - /test',
      });
    });

    it('[http-exception] - should fallback message when response.message is falsy', () => {
      const { mockHost } = mockHelpers.nestjs.getMocks();

      const exception = new HttpException({}, 400);
      exception.message = 'FALLBACK MESSAGE';

      filter.catch(exception, mockHost.arguments);

      expect(mockHost.status).toHaveBeenCalledWith(400);
      expect(mockHost.json).toHaveBeenCalledWith({
        status: 400,
        message: 'FALLBACK MESSAGE',
        referrer: '[GET][default] - /test',
      });
    });
  });
});
