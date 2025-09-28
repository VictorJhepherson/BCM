jest.mock('./src/models', () => ({
  AppError: {
    handler: jest.fn().mockImplementation(({ referrer, error }) => ({
      referrer,
      error,
    })),
    withLogger: jest.fn().mockImplementation((logger, { referrer, error }) => {
      logger.error(referrer, { error });
      return { referrer, error };
    }),
  },
}));
