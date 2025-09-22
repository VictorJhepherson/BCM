import { Test } from '@nestjs/testing';
import {
  mockData,
  MockDataFactory,
  MockFactory,
  MockLanguage,
  MockServiceProps,
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

const { dto, data, filter } = new MockDataFactory<MockLanguage>(
  mockData.factory.language,
)
  .select('data')
  .addData('id', mockData.values.mongo.id)
  .createMock();

describe('[services] - LanguageService', () => {
  const context = {} as MockServiceProps<LanguageService, LanguageRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: LanguageRepository,
          useFactory: () =>
            new MockFactory<LanguageRepository>()
              .addMethod('getAll', jest.fn())
              .addMethod('addLanguage', jest.fn())
              .addMethod('editLanguage', jest.fn())
              .addMethod('removeLanguage', jest.fn())
              .createMock(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(LanguageRepository);
    context.service = moduleRef.get(LanguageService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all languages', async () => {
      (context.repository.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.getAll as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll()).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should added a language', async () => {
      (context.repository.addLanguage as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addLanguage(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.addLanguage as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addLanguage(dto.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edited a language', async () => {
      (context.repository.editLanguage as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editLanguage(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.editLanguage as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editLanguage(filter, dto.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });
  });

  describe('[removeLanguage]', () => {
    it('[success] - should removed a language', async () => {
      (context.repository.removeLanguage as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.service.removeLanguage(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.removeLanguage as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.removeLanguage(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
