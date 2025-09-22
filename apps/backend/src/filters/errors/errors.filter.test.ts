import { HttpException } from '@nestjs/common';
import { AppError } from '@shared/core';
import { mockHelpers } from '@shared/testing';
import { AppErrorFilter } from './errors.filter';

describe('[filters] - AppErrorFilter', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[catch]', () => {
    const filter = new AppErrorFilter();

    it('[app-error] - should handle the error correctly', () => {
      const { mockHost, mockStatus, mockJson } = mockHelpers.filters.getMocks();

      const exception = new AppError({
        referrer: '[custom]',
        error: new Error('ERROR TEST'),
      });

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        status: 500,
        message: 'ERROR TEST',
        referrer: '[GET][custom] - /test',
      });
    });

    it('[http-exception] - should handle the error correctly', () => {
      const { mockHost, mockStatus, mockJson } = mockHelpers.filters.getMocks();

      const exception = new HttpException({ message: 'ERROR TEST' }, 400);

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        status: 400,
        message: 'ERROR TEST',
        referrer: '[GET][default] - /test',
      });
    });

    it('[http-exception] - should fallback message when response.message is falsy', () => {
      const { mockHost, mockStatus, mockJson } = mockHelpers.filters.getMocks();

      const exception = new HttpException({}, 400);
      exception.message = 'FALLBACK MESSAGE';

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        status: 400,
        message: 'FALLBACK MESSAGE',
        referrer: '[GET][default] - /test',
      });
    });
  });
});
