import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ServiceMockProps,
  TranslationMock,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { TranslationRepository } from '../repositories/translations.repository';
import { TranslationService } from './translations.service';

jest.mock('../repositories/translations.repository');
jest.mock('../mappers/translations.mapper', () => ({
  ...jest.requireActual('../mappers/translations.mapper'),
  TranslationMapper: jest.fn().mockImplementation(() => ({
    mapTranslation: jest.fn().mockImplementation((data) => data),
    mapTranslations: jest.fn().mockImplementation((data) => data),
  })),
}));

const { dto, data, filter } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
).build();

describe('[services] - TranslationService', () => {
  const context = {} as ServiceMockProps<
    TranslationService,
    TranslationRepository
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TranslationService,
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
          provide: TranslationRepository,
          useFactory: () =>
            new MockMethodFactory<TranslationRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('create', jest.fn())
              .add('update', jest.fn())
              .add('deleteMany', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(TranslationRepository);
    context.service = moduleRef.get(TranslationService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getByProject]', () => {
    it('[success] - should return all translations by project', async () => {
      (context.repository.findMany as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getByProject(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getByProject(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[getByLanguage]', () => {
    it('[success] - should return a translation by language', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getByLanguage(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getByLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a translation by language', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.getByLanguage(filter)).rejects.toThrow(
        `Unable to find a translation for: ${format.base(filter)}`,
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should added a translation', async () => {
      (context.repository.create as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addTranslation(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.create as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addTranslation(dto.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edited a translation', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editTranslation(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.update as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editTranslation(filter, dto.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to add a translation', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(
        context.service.editTranslation(filter, dto.edit),
      ).rejects.toThrow(
        `Unable to find a translation for: ${format.base(filter)}`,
      );
    });
  });

  describe('[deleteByProject]', () => {
    it('[success] - should removed translations by project', async () => {
      (context.repository.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteByProject(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.deleteMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteByProject(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to remove all translations by project', async () => {
      (context.repository.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.service.deleteByProject(filter)).rejects.toThrow(
        `Failed to delete translation(s) for: ${format.base(filter)}`,
      );
    });
  });

  describe('[deleteByLanguage]', () => {
    it('[success] - should removed translations by language', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteByLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteByLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to remove a translation', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.service.deleteByLanguage(filter)).rejects.toThrow(
        `Failed to delete a translation for: ${format.base(filter)}`,
      );
    });
  });
});
