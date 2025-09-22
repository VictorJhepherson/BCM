import { Test } from '@nestjs/testing';
import {
  MockControllerProps,
  mockData,
  MockDataFactory,
  MockFactory,
  MockTranslation,
} from '@shared/testing';
import { TranslationService } from '../services/translations.service';
import { TranslationController } from './translations.controller';

jest.mock('../services/translations.service');

const { dto, data, filter } = new MockDataFactory<MockTranslation>(
  mockData.factory.translation,
)
  .select('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[controllers] - TranslationController', () => {
  const context = {} as MockControllerProps<
    TranslationController,
    TranslationService
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TranslationController],
      providers: [
        {
          provide: TranslationService,
          useFactory: () =>
            new MockFactory<TranslationService>()
              .addMethod('getByProject', jest.fn())
              .addMethod('getByLanguage', jest.fn())
              .addMethod('addTranslation', jest.fn())
              .addMethod('editTranslation', jest.fn())
              .addMethod('removeByProject', jest.fn())
              .addMethod('removeByLanguage', jest.fn())
              .createMock(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(TranslationService);
    context.controller = moduleRef.get(TranslationController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getByProject]', () => {
    it('[success] - should return all translations by project', async () => {
      (context.service.getByProject as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getByProject(filter.projectId)).toEqual([
        data,
      ]);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getByProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getByProject(filter.projectId),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[getByLanguage]', () => {
    it('[success] - should return a translation by language', async () => {
      (context.service.getByLanguage as jest.Mock).mockResolvedValue([data]);

      expect(
        await context.controller.getByLanguage(
          filter.projectId,
          filter.languageId,
        ),
      ).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getByLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getByLanguage(filter.projectId, filter.languageId),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should added a translation', async () => {
      (context.service.addTranslation as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addTranslation(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.addTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addTranslation(dto.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edited a translation', async () => {
      (context.service.editTranslation as jest.Mock).mockResolvedValue(data);

      expect(
        await context.controller.editTranslation(
          filter.projectId,
          filter.languageId,
          dto.edit,
        ),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.editTranslation as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editTranslation(
          filter.projectId,
          filter.languageId,
          dto.edit,
        ),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[removeByProject]', () => {
    it('[success] - should removed translations by project', async () => {
      (context.service.removeByProject as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(
        await context.controller.removeByProject(filter.projectId),
      ).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.removeByProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.removeByProject(filter.projectId),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[removeByLanguage]', () => {
    it('[success] - should removed translations by language', async () => {
      (context.service.removeByLanguage as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(
        await context.controller.removeByLanguage(
          filter.projectId,
          filter.languageId,
        ),
      ).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.removeByLanguage as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.removeByLanguage(
          filter.projectId,
          filter.languageId,
        ),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });
});
