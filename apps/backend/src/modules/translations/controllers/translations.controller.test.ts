import { TranslationService } from '@/modules/translations/services/translations.service';
import { LoggerProvider } from '@/shared/providers';

import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  TMockPropsOf,
  TMockTranslation,
} from '@bcm/testing';

import { Test } from '@nestjs/testing';
import { TranslationController } from './translations.controller';

const { data, filter, payload } = new MockDataFactory<TMockTranslation>(
  mockData.translation,
).build();

describe('[controllers] - ProjectController', () => {
  const context = {} as TMockPropsOf<
    'controller',
    TranslationController,
    { logger: LoggerProvider; service: TranslationService }
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
              .add('archiveTranslation', jest.fn())
              .add('deleteTranslation', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.controller = moduleRef.get(TranslationController);
    context.others = {
      logger: moduleRef.get(LoggerProvider),
      service: moduleRef.get(TranslationService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all translations', async () => {
      (context.others.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll(filter.default)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getAll(filter.default),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a translation', async () => {
      (context.others.service.getById as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.getById(filter.united)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getById as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getById(filter.united),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should add a translation', async () => {
      (context.others.service.addTranslation as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.controller.addTranslation(payload.add)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.addTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.addTranslation(payload.add),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.service.editTranslation as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.controller.editTranslation(filter.united, payload.edit),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.editTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editTranslation(filter.united, payload.edit),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[archiveTranslation]', () => {
    it('[success] - should archive a translation', async () => {
      (
        context.others.service.archiveTranslation as jest.Mock
      ).mockResolvedValue(data);

      expect(
        await context.controller.archiveTranslation(
          filter.united,
          payload.archive,
        ),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (
        context.others.service.archiveTranslation as jest.Mock
      ).mockRejectedValue(new Error('SERVICE ERROR'));

      await expect(
        context.controller.archiveTranslation(filter.united, payload.archive),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[deleteTranslation]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.service.deleteTranslation as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(
        await context.controller.deleteTranslation(filter.united),
      ).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.deleteTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.deleteTranslation(filter.united),
      ).rejects.toMatchObject({
        referrer: '[translations][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });
});
