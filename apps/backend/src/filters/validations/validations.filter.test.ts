import { BadRequestException } from '@nestjs/common';
import { mockHelpers } from '@shared/testing';
import { ValidationFilter } from './validations.filter';

describe('[filters] - ValidationFilter', () => {
  afterEach(() => jest.clearAllMocks());

  describe('[catch]', () => {
    const filter = new ValidationFilter();

    it('[bad-request-exception] - should handle the error correctly', () => {
      const { mockHost, mockStatus, mockJson } = mockHelpers.filters.getMocks();

      const exception = new BadRequestException({ message: ['ERROR TEST'] });

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        status: 400,
        messages: ['ERROR TEST'],
        referrer: '[GET][validators] - /test',
      });
    });
  });
});
