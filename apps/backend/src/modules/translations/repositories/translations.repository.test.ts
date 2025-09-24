import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TranslationEntity } from '@shared/models';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  RepositoryMockProps,
  TranslationMock,
} from '@shared/testing';
import { Model } from 'mongoose';
import { TranslationRepository } from './translations.repository';

const { dto, data, filter } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
).build();

describe('[repositories] - TranslationRepository', () => {
  const context = {} as RepositoryMockProps<
    TranslationRepository,
    Model<TranslationEntity>
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TranslationRepository,
        {
          provide: getModelToken(TranslationEntity.name),
          useFactory: () =>
            new MockMethodFactory<Model<TranslationEntity>>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('findOne', jest.fn())
              .add('deleteOne', jest.fn())
              .add('deleteMany', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(TranslationEntity.name));
    context.repository = moduleRef.get(TranslationRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[findMany]', () => {
    it('[success] - should return all translations by project', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([data]),
          }),
        }),
      });

      expect(await context.repository.findMany(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
          }),
        }),
      });

      await expect(context.repository.findMany(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[findOne]', () => {
    it('[success] - should return translation by language', async () => {
      (context.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(data),
          }),
        }),
      });

      expect(await context.repository.findOne(filter)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
          }),
        }),
      });

      await expect(context.repository.findOne(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[create]', () => {
    it('[success] - should added a translation', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(data);

      expect(await context.repository.create(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.create(dto.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[update]', () => {
    it('[success] - should edited a translation', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.update(filter, dto.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.update(filter, dto.edit)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[deleteMany]', () => {
    it('[success] - should removed all translations by project', async () => {
      (context.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteMany(filter)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteMany as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteMany(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should removed a translation', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteOne(filter)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteOne(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
