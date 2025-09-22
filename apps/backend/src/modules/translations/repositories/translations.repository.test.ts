import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { TranslationEntity } from '@shared/models';
import {
  mockData,
  MockDataFactory,
  MockFactory,
  MockRepositoryProps,
  MockTranslation,
} from '@shared/testing';
import { Model } from 'mongoose';
import util from 'node:util';
import { TranslationRepository } from './translations.repository';

const { dto, data, filter } = new MockDataFactory<MockTranslation>(
  mockData.factory.translation,
)
  .select('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[repositories] - TranslationRepository', () => {
  const context = {} as MockRepositoryProps<
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
            new MockFactory<Model<TranslationEntity>>()
              .addMethod('find', jest.fn())
              .addMethod('create', jest.fn())
              .addMethod('findOne', jest.fn())
              .addMethod('deleteOne', jest.fn())
              .addMethod('deleteMany', jest.fn())
              .addMethod('findOneAndUpdate', jest.fn())
              .createMock(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(TranslationEntity.name));
    context.repository = moduleRef.get(TranslationRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getByProject]', () => {
    it('[success] - should return all translations by project', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([data]),
          }),
        }),
      });

      expect(await context.repository.getByProject(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
          }),
        }),
      });

      await expect(context.repository.getByProject(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to get translation by project when is undefined', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      });

      await expect(context.repository.getByProject(filter)).rejects.toThrow(
        `Unable to find translation(s) by: ${util.inspect(filter)}`,
      );
    });

    it('[edge-case] - should failed to get translation by project when is empty array', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await expect(context.repository.getByProject(filter)).rejects.toThrow(
        `Unable to find translation(s) by: ${util.inspect(filter)}`,
      );
    });
  });

  describe('[getByLanguage]', () => {
    it('[success] - should return translation by language', async () => {
      (context.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(data),
          }),
        }),
      });

      expect(await context.repository.getByLanguage(filter)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
          }),
        }),
      });

      await expect(context.repository.getByLanguage(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to get translation by language when is undefined', async () => {
      (context.model.findOne as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(undefined),
          }),
        }),
      });

      await expect(context.repository.getByLanguage(filter)).rejects.toThrow(
        `Unable to find translation by: ${util.inspect(filter)}`,
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should added a translation', async () => {
      (context.model.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.addTranslation(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.addTranslation(dto.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to add a translation', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(undefined);

      await expect(context.repository.addTranslation(dto.add)).rejects.toThrow(
        `Failed to create a translation for: ${util.inspect(dto.add)}`,
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edited a translation', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(
        await context.repository.editTranslation(filter, dto.edit),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.editTranslation(filter, dto.edit),
      ).rejects.toThrow('MODEL ERROR');
    });

    it('[edge-case] - should failed to add a translation', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.repository.editTranslation(filter, dto.edit),
      ).rejects.toThrow(
        `Unable to find a translation for: ${util.inspect(filter)}`,
      );
    });
  });

  describe('[removeByProject]', () => {
    it('[success] - should removed all translations by project', async () => {
      (context.model.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.repository.removeByProject(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteMany as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.removeByProject(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to remove all translations by project', async () => {
      (context.model.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.repository.removeByProject(filter)).rejects.toThrow(
        `Failed to delete translation(s) for: ${util.inspect(filter)}`,
      );
    });
  });

  describe('[removeByLanguage]', () => {
    it('[success] - should removed a translation', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.repository.removeByLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.removeByLanguage(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to remove a translation', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.repository.removeByLanguage(filter)).rejects.toThrow(
        `Failed to delete a translation for: ${util.inspect(filter)}`,
      );
    });
  });
});
