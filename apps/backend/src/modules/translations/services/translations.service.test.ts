import { Test } from '@nestjs/testing';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ServiceMockProps,
  TranslationMock,
} from '@shared/testing';
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
          provide: TranslationRepository,
          useFactory: () =>
            new MockMethodFactory<TranslationRepository>()
              .add('getByProject', jest.fn())
              .add('getByLanguage', jest.fn())
              .add('addTranslation', jest.fn())
              .add('editTranslation', jest.fn())
              .add('removeByProject', jest.fn())
              .add('removeByLanguage', jest.fn())
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
      (context.repository.getByProject as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getByProject(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.getByProject as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getByProject(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[getByProject]', () => {
    it('[success] - should return a translation by language', async () => {
      (context.repository.getByLanguage as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getByLanguage(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.getByLanguage as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getByLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should added a translation', async () => {
      (context.repository.addTranslation as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addTranslation(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.addTranslation as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addTranslation(dto.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edited a translation', async () => {
      (context.repository.editTranslation as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editTranslation(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.editTranslation as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editTranslation(filter, dto.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });
  });

  describe('[removeByProject]', () => {
    it('[success] - should removed translations by project', async () => {
      (context.repository.removeByProject as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.service.removeByProject(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.removeByProject as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.removeByProject(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[removeByLanguage]', () => {
    it('[success] - should removed translations by language', async () => {
      (context.repository.removeByLanguage as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.service.removeByLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.removeByLanguage as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.removeByLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
