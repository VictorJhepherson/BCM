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

const { ref, body, data, filter } = new MockDataFactory<TranslationMock>(
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
              .add('deleteOne', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(TranslationRepository);
    context.service = moduleRef.get(TranslationService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all translations', async () => {
      (context.repository.findMany as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getAll(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should return a translation', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getById(ref)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a translation', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.getById(ref)).rejects.toThrow(
        `Unable to find a translation for: ${format.base(ref)}`,
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should added a translation', async () => {
      (context.repository.create as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addTranslation(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.create as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addTranslation(body.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edited a translation', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editTranslation(ref, body.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.update as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editTranslation(ref, body.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to add a translation', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(
        context.service.editTranslation(ref, body.edit),
      ).rejects.toThrow(
        `Unable to find a translation for: ${format.base(ref)}`,
      );
    });
  });

  describe('[deleteTranslation]', () => {
    it('[success] - should removed translations by language', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteTranslation(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteTranslation(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to remove a translation', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.service.deleteTranslation(ref)).rejects.toThrow(
        `Failed to delete a translation for: ${format.base(ref)}`,
      );
    });
  });
});
