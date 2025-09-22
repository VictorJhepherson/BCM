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
import util from 'node:util';
import { LanguageRepository } from './languages.repository';

const { dto, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
)
  .select('data')
  .add('_id', mockData.values.mongo._id)
  .build();

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
          provide: getModelToken(LanguageEntity.name),
          useFactory: () =>
            new MockMethodFactory<Model<LanguageEntity>>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('deleteOne', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(LanguageEntity.name));
    context.repository = moduleRef.get(LanguageRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all languages', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([data]),
      });

      expect(await context.repository.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.getAll()).rejects.toThrow('MODEL ERROR');
    });

    it('[edge-case] - should failed to get all languages when is undefined', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      await expect(context.repository.getAll()).rejects.toThrow(
        'Unable to find all languages.',
      );
    });

    it('[edge-case] - should failed to get all languages when is empty array', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(context.repository.getAll()).rejects.toThrow(
        'Unable to find all languages.',
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should added languages', async () => {
      (context.model.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.addLanguage(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.addLanguage(dto.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to add a language', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(undefined);

      await expect(context.repository.addLanguage(dto.add)).rejects.toThrow(
        `Failed to create a language for: ${util.inspect(dto.add)}`,
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edited a language', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.editLanguage(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.editLanguage(filter, dto.edit),
      ).rejects.toThrow('MODEL ERROR');
    });

    it('[edge-case] - should failed to edit a language', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.repository.editLanguage(filter, dto.edit),
      ).rejects.toThrow(`Unable to find a language for: ${filter.id}`);
    });
  });

  describe('[removeLanguage]', () => {
    it('[success] - should removed a language', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.repository.removeLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.removeLanguage(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to remove a language', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.repository.removeLanguage(filter)).rejects.toThrow(
        `Failed to delete a language for: ${filter.id}`,
      );
    });
  });
});
