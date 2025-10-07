import { TranslationEntity } from '@/modules/translations/models';
import { LoggerProvider } from '@/shared/providers';

import {
  MockDataFactory,
  MockMethodFactory,
  TMockPropsOf,
  TMockTranslation,
  mockData,
} from '@bcm/testing';

import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';

import { TranslationRepository } from './translations.repository';

const { data, filter, payload } = new MockDataFactory<TMockTranslation>(
  mockData.translation,
).build();

describe('[repositories] - TranslationRepository', () => {
  const context = {} as TMockPropsOf<
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
              .add('findOne', jest.fn())
              .add('create', jest.fn())
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
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(data),
        }),
      });

      expect(
        await context.repository.findOne({ filter: filter.united }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
        }),
      });

      await expect(
        context.repository.findOne({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
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
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([data]),
              }),
            }),
          }),
        }),
      });

      expect(
        await context.repository.findMany({ filter: filter.default }),
      ).toEqual({
        data: [data],
        sort: mockData.filter.sort,
        pagination: { ...mockData.filter.pagination, total: 100 },
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
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
              }),
            }),
          }),
        }),
      });

      await expect(
        context.repository.findMany({ filter: filter.default }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });

    it('[edge-case] - should get all translations with sort.order ASC', async () => {
      (context.others.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.others.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([data]),
              }),
            }),
          }),
        }),
      });

      expect(
        await context.repository.findMany({
          filter: {
            ...filter.default,
            sort: { by: 'createdAt', order: 'ASC' },
          },
        }),
      ).toEqual({
        data: [data],
        sort: { ...mockData.filter.sort, order: 'ASC' },
        pagination: { ...mockData.filter.pagination, total: 100 },
      });
    });
  });

  describe('[createOne]', () => {
    it('[success] - should add translation', async () => {
      (context.others.model.create as jest.Mock).mockResolvedValue(data);

      expect(
        await context.repository.createOne({ payload: payload.add }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(
        context.repository.createOne({ payload: payload.add }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });
  });

  describe('[updateOne]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(data),
        }),
      });

      expect(
        await context.repository.updateOne({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
        }),
      });

      await expect(
        context.repository.updateOne({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });
  });

  describe('[updateMany]', () => {
    it('[success] - should edit filtered translations', async () => {
      (context.others.model.updateMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(
        await context.repository.updateMany({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.updateMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.updateMany({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(
        await context.repository.deleteOne({ filter: filter.united }),
      ).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.deleteOne({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });
  });

  describe('[deleteMany]', () => {
    it('[success] - should delete filtered translations', async () => {
      (context.others.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(
        await context.repository.deleteMany({ filter: filter.united }),
      ).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.deleteMany({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][repository]',
        error: { message: 'MODEL ERROR' },
      });
    });
  });
});
