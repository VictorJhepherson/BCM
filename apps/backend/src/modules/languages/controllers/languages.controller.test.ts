import { Test } from '@nestjs/testing';
import {
  MockControllerProps,
  MockDataFactory,
  MockFactory,
  MockLanguage,
  mockData,
} from '@shared/testing';
import { LanguageService } from '../services/languages.service';
import { LanguageController } from './languages.controller';

jest.mock('../services/languages.service');

const { dto, data, filter } = new MockDataFactory<MockLanguage>(
  mockData.factory.language,
)
  .select('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[controllers] - LanguageController', () => {
  const context = {} as MockControllerProps<
    LanguageController,
    LanguageService
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        {
          provide: LanguageService,
          useFactory: () =>
            new MockFactory<LanguageService>()
              .addMethod('getAll', jest.fn())
              .addMethod('addLanguage', jest.fn())
              .addMethod('editLanguage', jest.fn())
              .addMethod('removeLanguage', jest.fn())
              .createMock(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(LanguageService);
    context.controller = moduleRef.get(LanguageController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all languages', async () => {
      (context.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getAll()).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should added a language', async () => {
      (context.service.addLanguage as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addLanguage(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.addLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addLanguage(dto.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edited a language', async () => {
      (context.service.editLanguage as jest.Mock).mockResolvedValue(data);

      expect(
        await context.controller.editLanguage(filter.id, dto.edit),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.editLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editLanguage(filter.id, dto.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[removeLanguage]', () => {
    it('[success] - should removed a language', async () => {
      (context.service.removeLanguage as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.controller.removeLanguage(filter.id)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.removeLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.removeLanguage(filter.id),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });
});
