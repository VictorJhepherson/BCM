import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  LanguageMock,
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ServiceMockProps,
} from '@shared/testing';
import { LanguageRepository } from '../repositories/languages.repository';
import { LanguageService } from './languages.service';

jest.mock('../repositories/languages.repository');
jest.mock('../mappers/languages.mapper', () => ({
  ...jest.requireActual('../mappers/languages.mapper'),
  LanguageMapper: jest.fn().mockImplementation(() => ({
    mapLanguages: jest.fn().mockImplementation((data) => data),
  })),
}));

const { dto, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[services] - LanguageService', () => {
  const context = {} as ServiceMockProps<LanguageService, LanguageRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
          useFactory: () =>
            new MockMethodFactory<LanguageRepository>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('update', jest.fn())
              .add('delete', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(LanguageRepository);
    context.service = moduleRef.get(LanguageService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all languages', async () => {
      (context.repository.find as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.find as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll()).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should return empty array when has no languages', async () => {
      (context.repository.find as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll()).toEqual([]);
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should added a language', async () => {
      (context.repository.create as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addLanguage(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.create as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addLanguage(dto.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edited a language', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editLanguage(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.update as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editLanguage(filter, dto.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to edit a language', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(
        context.service.editLanguage(filter, dto.edit),
      ).rejects.toThrow(
        `Unable to find a language for: ${format.base(filter)}`,
      );
    });
  });

  describe('[deleteLanguage]', () => {
    it('[success] - should removed a language', async () => {
      (context.repository.delete as jest.Mock).mockResolvedValue(data);

      expect(await context.service.deleteLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.delete as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to remove a language', async () => {
      (context.repository.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.deleteLanguage(filter)).rejects.toThrow(
        `Failed to delete a language for: ${format.base(filter)}`,
      );
    });
  });
});
