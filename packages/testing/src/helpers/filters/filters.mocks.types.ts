import { ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

export type Options = {
  request?: Partial<Request>;
  response?: Partial<Response>;
};

export type FilterMock = {
  mockHost: ArgumentsHost;
  mockStatus: jest.Mock;
  mockJson: jest.Mock;
};
