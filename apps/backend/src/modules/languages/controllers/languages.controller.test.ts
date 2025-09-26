import { Test } from '@nestjs/testing';
import {
  ControllerMockProps,
  LanguageMock,
  MockDataFactory,
  MockMethodFactory,
  mockData,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { LanguageService } from '../services/languages.service';
import { LanguageController } from './languages.controller';

const { ref, body, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[controllers] - LanguageController', () => {
  const context = {} as ControllerMockProps<
    LanguageController,
    LanguageService
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
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
          provide: LanguageService,
          useFactory: () =>
            new MockMethodFactory<LanguageService>()
              .add('getAll', jest.fn())
              .add('getById', jest.fn())
              .add('addLanguage', jest.fn())
              .add('editLanguage', jest.fn())
              .add('deleteLanguage', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(LanguageService);
    context.controller = moduleRef.get(LanguageController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all languages', async () => {
      (context.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getAll(filter)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a language', async () => {
      (context.service.getById as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.getById(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getById as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getById(ref)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should add a language', async () => {
      (context.service.addLanguage as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addLanguage(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.addLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addLanguage(body.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edit a language', async () => {
      (context.service.editLanguage as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.editLanguage(ref._id, body.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.service.editLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editLanguage(ref._id, body.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[deleteLanguage]', () => {
    it('[success] - should delete a language', async () => {
      (context.service.deleteLanguage as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.controller.deleteLanguage(ref._id)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.deleteLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.deleteLanguage(ref._id)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });
});
