jest.mock('./src/models', () => ({
  AppError: {
    handler: jest.fn().mockImplementation(({ referrer, error }) => ({
      referrer,
      error,
    })),
  },
}));
