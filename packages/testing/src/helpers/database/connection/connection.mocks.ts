import { ClientSession, Connection } from 'mongoose';

export const getConnection = <T = Connection>(): T => {
  return {
    startSession: jest.fn().mockResolvedValue({
      endSession: jest.fn(),
      abortTransaction: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
    } as unknown as ClientSession),
  } as T;
};
