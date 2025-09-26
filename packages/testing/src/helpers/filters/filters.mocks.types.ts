import { ArgumentsHost } from '@nestjs/common';

export type FilterMock = {
  mockJson: jest.Mock;
  mockStatus: jest.Mock;
  mockHost: ArgumentsHost;
};
