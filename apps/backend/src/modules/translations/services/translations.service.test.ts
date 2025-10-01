import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  MockPropsOf,
  TranslationMock,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { TranslationMapper } from '../mappers/translations.mapper';
import { TranslationRepository } from '../repositories/translations.repository';
import { TranslationService } from './translations.service';

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
  const context = {} as MockPropsOf<
    'service',
    TranslationService,
    {
      mapper: TranslationMapper;
      repository: TranslationRepository;
    }
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
          provide: TranslationMapper,
          useFactory: () =>
            new MockMethodFactory<TranslationMapper>()
              .add('mapTranslation', jest.fn())
              .add('mapTranslations', jest.fn())
              .build(),
        },
        {
          provide: TranslationRepository,
          useFactory: () =>
            new MockMethodFactory<TranslationRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('createOne', jest.fn())
              .add('updateOne', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(TranslationService);
    context.others = {
      mapper: moduleRef.get(TranslationMapper),
      repository: moduleRef.get(TranslationRepository),
    };
  });

  beforeEach(() => {
    (context.others.mapper.mapTranslation as jest.Mock).mockImplementation(
      (data) => data,
    );

    (context.others.mapper.mapTranslations as jest.Mock).mockImplementation(
      (data) => data,
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all translations', async () => {
      (context.others.repository.findMany as jest.Mock).mockResolvedValue([
        data,
      ]);

      expect(await context.service.getAll(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.findMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a translation', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue([
        data,
      ]);

      expect(await context.service.getById(ref)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a translation', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        `Unable to find a translation for: ${format.base(ref)}`,
      );
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should add a translation', async () => {
      (context.others.repository.createOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.service.addTranslation(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.createOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addTranslation(body.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.service.editTranslation(ref, body.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editTranslation(ref, body.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to edit a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.editTranslation(ref, body.edit),
      ).rejects.toThrow(
        `Unable to find a translation for: ${format.base(ref)}`,
      );
    });
  });

  describe('[deleteTranslation]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteTranslation(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteTranslation(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
