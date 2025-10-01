import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  LanguageMock,
  mockData,
  MockDataFactory,
  mockHelpers,
  MockMethodFactory,
  MockPropsOf,
} from '@shared/testing';
import { LoggerProvider } from '../../../../providers';
import { TranslationRepository } from '../../../translations/repositories/translations.repository';
import { LanguageRepository } from '../../repositories/languages.repository';
import { LanguageDeleteStrategy } from './languages-delete.strategy';

const { mockConnection } = mockHelpers.mongo.getMocks();

const { ref, body, data } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[strategies] - LanguageDeleteStrategy', () => {
  const context = {} as MockPropsOf<
    'strategy',
    LanguageDeleteStrategy,
    {
      logger: LoggerProvider;
      language: LanguageRepository;
      translation: TranslationRepository;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageDeleteStrategy,
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
              .add('updateOne', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
        {
          provide: TranslationRepository,
          useFactory: () =>
            new MockMethodFactory<TranslationRepository>()
              .add('updateMany', jest.fn())
              .add('deleteMany', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.strategy = moduleRef.get(LanguageDeleteStrategy);
    context.others = {
      logger: moduleRef.get(LoggerProvider),
      language: moduleRef.get(LanguageRepository),
      translation: moduleRef.get(TranslationRepository),
    };
  });

  describe('[softDelete]', () => {
    it('[success] - should apply the update', async () => {
      (context.others.language.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      expect(await context.strategy.softDelete(ref, body.archive)).toEqual(
        data,
      );
    });

    it('[failure][updateOne] - should handler an error', async () => {
      (context.others.language.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[failure][updateMany] - should handler an error', async () => {
      (context.others.language.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case][updateOne] - should failed to archive a language', async () => {
      (context.others.language.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow(
        `Unable to archive a language for: ${format.base(ref)}`,
      );
    });

    it('[edge-case][updateMany] - should failed to archive translations', async () => {
      (context.others.language.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow(
        `Unable to archive translations by language: ${format.base(ref)}`,
      );
    });
  });

  describe('[hardDelete]', () => {
    it('[success] - should apply the delete', async () => {
      (context.others.language.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.strategy.hardDelete(ref)).toBeFalsy();
    });

    it('[failure][deleteOne] - should handler an error', async () => {
      (context.others.language.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[failure][deleteMany] - should handler an error', async () => {
      (context.others.language.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
