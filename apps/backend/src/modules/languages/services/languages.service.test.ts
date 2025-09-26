import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  LanguageMock,
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ServiceMockProps,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { LanguageRepository } from '../repositories/languages.repository';
import { LanguageService } from './languages.service';

jest.mock('../mappers/languages.mapper', () => ({
  ...jest.requireActual('../mappers/languages.mapper'),
  LanguageMapper: jest.fn().mockImplementation(() => ({
    mapLanguage: jest.fn().mockImplementation((data) => data),
    mapLanguages: jest.fn().mockImplementation((data) => data),
  })),
}));

const { ref, body, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[services] - LanguageService', () => {
  const context = {} as ServiceMockProps<LanguageService, LanguageRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageService,
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
          provide: LanguageRepository,
          useFactory: () =>
            new MockMethodFactory<LanguageRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('create', jest.fn())
              .add('update', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(LanguageRepository);
    context.service = moduleRef.get(LanguageService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all languages', async () => {
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

    it('[edge-case] - should get an empty array when has no languages', async () => {
      (context.repository.findMany as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll(filter)).toEqual([]);
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a language', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(data);

      expect(await context.service.getById(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a language', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.getById(ref)).rejects.toThrow(
        `Unable to find a language for: ${format.base(ref)}`,
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should add a language', async () => {
      (context.repository.create as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addLanguage(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.create as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addLanguage(body.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edit a language', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editLanguage(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.update as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editLanguage(ref, body.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to edit a language', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(
        context.service.editLanguage(ref, body.edit),
      ).rejects.toThrow(`Unable to find a language for: ${format.base(ref)}`);
    });
  });

  describe('[deleteLanguage]', () => {
    it('[success] - should delete a language', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteLanguage(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteLanguage(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to delete a language', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.service.deleteLanguage(ref)).rejects.toThrow(
        `Failed to delete a language for: ${format.base(ref)}`,
      );
    });
  });
});
