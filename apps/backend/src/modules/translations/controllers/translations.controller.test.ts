import { Test } from '@nestjs/testing';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  MockPropsOf,
  TranslationMock,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { TranslationService } from '../services/translations.service';
import { TranslationController } from './translations.controller';

const { ref, body, data, filter } = new MockDataFactory<TranslationMock>(
  mockData.factory.translation,
).build();

describe('[controllers] - TranslationController', () => {
  const context = {} as MockPropsOf<
    'controller',
    TranslationController,
    {
      service: TranslationService;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TranslationController],
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
          provide: TranslationService,
          useFactory: () =>
            new MockMethodFactory<TranslationService>()
              .add('getAll', jest.fn())
              .add('getById', jest.fn())
              .add('addTranslation', jest.fn())
              .add('editTranslation', jest.fn())
              .add('deleteTranslation', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.controller = moduleRef.get(TranslationController);
    context.others = {
      service: moduleRef.get(TranslationService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all translations', async () => {
      (context.others.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll(filter.controller)).toEqual([
        data,
      ]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getAll(filter.controller),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a translation', async () => {
      (context.others.service.getById as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getById(ref)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getById as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getById(ref)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should add a translation', async () => {
      (context.others.service.addTranslation as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.controller.addTranslation(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.addTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addTranslation(body.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.service.editTranslation as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.controller.editTranslation(ref, body.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.editTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editTranslation(ref, body.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[deleteTranslation]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.service.deleteTranslation as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.controller.deleteTranslation(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.deleteTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.deleteTranslation(ref)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });
});
