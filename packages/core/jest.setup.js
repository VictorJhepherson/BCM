const { HttpException } = require('@nestjs/common')

jest.mock('./src/models', () => ({
  AppError: {
    handler: jest.fn().mockImplementation((logger, { referrer, error }) => {
      logger.error(referrer, { error });
      if (error instanceof HttpException) {
        return { referrer, error: { message: error.message || 'INTERNAL_SERVER_ERROR' } }
      }

      return { referrer, error };
    }),
  },
}));
