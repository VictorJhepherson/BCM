require('reflect-metadata');
const { HttpException } = require('@nestjs/common');

jest.mock('@/shared/core', () => ({
  ...jest.requireActual('@/shared/core'),
  AppError: {
    handler: jest.fn().mockImplementation((logger, { referrer, error }) => {
      logger.error(referrer, { error });
      if (error?.referrer) return error;
      if (error instanceof HttpException || error instanceof Error) {
        throw { referrer, error: { message: error.message || 'INTERNAL_SERVER_ERROR' } }
      }

      throw { referrer, error };
    }),
  },
}));
