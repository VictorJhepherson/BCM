import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { LanguageEntity } from '@shared/models';
import {
  LanguageMock,
  MockDataFactory,
  MockMethodFactory,
  RepositoryMockProps,
  mockData,
} from '@shared/testing';
import { Model } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { LanguageRepository } from './languages.repository';

const { ref, body, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[repositories] - LanguageRepository', () => {
  const context = {} as RepositoryMockProps<
    LanguageRepository,
    Model<LanguageEntity>
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageRepository,
        {
          provide: LoggerProvider,
          useFactory: () =>
            new MockMethodFactory<LoggerProvider>()
              .add('info', jest.fn())
              .add('warn', jest.fn())
              .add('error', jest.fn())
              .add('debug', jest.fn())
              .build(),
        },
        {
          provide: getModelToken(LanguageEntity.name),
          useFactory: () =>
            new MockMethodFactory<Model<LanguageEntity>>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('deleteOne', jest.fn())
              .add('countDocuments', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(LanguageEntity.name));
    context.repository = moduleRef.get(LanguageRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[findMany]', () => {
    it('[success] - should return all languages', async () => {
      (context.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([data]),
            }),
          }),
        }),
      });

      expect(await context.repository.findMany(filter)).toEqual({
        data: [data],
        sort: mockData.values.filter.sort,
        pagination: { ...mockData.values.filter.pagination, total: 100 },
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
            }),
          }),
        }),
      });

      await expect(context.repository.findMany(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[create]', () => {
    it('[success] - should added languages', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(data);

      expect(await context.repository.create(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.create(body.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[update]', () => {
    it('[success] - should edited a language', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.update(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.update(ref, body.edit)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should removed a language', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteOne(ref)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteOne(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
