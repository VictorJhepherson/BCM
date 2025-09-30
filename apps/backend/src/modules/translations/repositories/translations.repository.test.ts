import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TranslationEntity } from '@shared/models';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  MockPropsOf,
  TranslationMock,
} from '@shared/testing';
import { Model } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { TranslationRepository } from './translations.repository';

const { ref, body, data, filter } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
).build();

describe('[repositories] - TranslationRepository', () => {
  const context = {} as MockPropsOf<
    'repository',
    TranslationRepository,
    {
      model: Model<TranslationEntity>;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TranslationRepository,
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
          provide: getModelToken(TranslationEntity.name),
          useFactory: () =>
            new MockMethodFactory<Model<TranslationEntity>>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('findOne', jest.fn())
              .add('deleteOne', jest.fn())
              .add('deleteMany', jest.fn())
              .add('updateMany', jest.fn())
              .add('countDocuments', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(TranslationRepository);
    context.others = {
      model: moduleRef.get(getModelToken(TranslationEntity.name)),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[findOne]', () => {
    it('[success] - should get a translation', async () => {
      (context.others.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(data),
          }),
        }),
      });

      expect(await context.repository.findOne(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
          }),
        }),
      });

      await expect(context.repository.findOne(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[findMany]', () => {
    it('[success] - should get all translations', async () => {
      (context.others.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.others.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                  exec: jest.fn().mockResolvedValue([data]),
                }),
              }),
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
      (context.others.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.others.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                lean: jest.fn().mockReturnValue({
                  exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
                }),
              }),
            }),
          }),
        }),
      });

      await expect(context.repository.findMany(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[createOne]', () => {
    it('[success] - should add a translation', async () => {
      (context.others.model.create as jest.Mock).mockResolvedValue(data);

      expect(await context.repository.createOne(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.createOne(body.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[updateOne]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(data),
        }),
      });

      expect(await context.repository.updateOne(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
        }),
      });

      await expect(
        context.repository.updateOne(ref, body.edit),
      ).rejects.toThrow('MODEL ERROR');
    });
  });

  describe('[updateMany]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.model.updateMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.updateMany(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.updateMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.updateMany(ref, body.edit),
      ).rejects.toThrow('MODEL ERROR');
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteOne(ref)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteOne(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[deleteMany]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteMany(ref)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteMany(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
