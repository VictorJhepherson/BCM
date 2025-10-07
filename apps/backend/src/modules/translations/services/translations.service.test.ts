import { TranslationMapper } from '@/modules/translations/mappers/translations.mapper';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { format } from '@/shared/helpers';
import { LoggerProvider } from '@/shared/providers';

import {
  mockData,
  MockDataFactory,
  mockHelpers,
  MockMethodFactory,
  TMockPropsOf,
  TMockTranslation,
} from '@bcm/testing';

import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { TranslationService } from './translations.service';

const { mockConnection } = mockHelpers.database.getMocks();
const { data, filter, payload } = new MockDataFactory<TMockTranslation>(
  mockData.translation,
).build();

describe('[services] - TranslationService', () => {
  const context = {} as TMockPropsOf<
    'service',
    TranslationService,
    {
      mapper: TranslationMapper;
      connection: Connection;
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
          provide: getConnectionToken(),
          useFactory: () =>
            new MockMethodFactory<Connection>()
              .add('startSession', jest.fn())
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
      connection: moduleRef.get(getConnectionToken()),
      repository: moduleRef.get(TranslationRepository),
    };
  });

  beforeEach(() => {
    (context.others.connection.startSession as jest.Mock).mockResolvedValue(
      mockConnection.startSession(),
    );

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

      expect(await context.service.getAll({ filter: filter.default })).toEqual([
        data,
      ]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.findMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.getAll({ filter: filter.default }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should get an empty array when has no translations', async () => {
      (context.others.repository.findMany as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll({ filter: filter.default })).toEqual(
        [],
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a translation', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(data);

      expect(await context.service.getById({ filter: filter.united })).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.getById({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should failed to get a translation', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.getById({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: {
          message: `Unable to find a translation for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[addTranslation]', () => {
    it('[success] - should add a translation', async () => {
      (context.others.repository.createOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.addTranslation({ payload: payload.add }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.createOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.addTranslation({ payload: payload.add }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });

  describe('[editTranslation]', () => {
    it('[success] - should edit a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.editTranslation({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editTranslation({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should failed to edit a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.editTranslation({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: {
          message: `Unable to find a translation for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[archiveTranslation]', () => {
    it('[success] - should archive a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.archiveTranslation({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.archiveTranslation({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should failed to archive a translation', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.archiveTranslation({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: {
          message: `Unable to archive a translation for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[deleteTranslation]', () => {
    it('[success] - should delete a translation', async () => {
      (context.others.repository.deleteOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(
        await context.service.deleteTranslation({ filter: filter.united }),
      ).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.deleteTranslation({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[translations][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });
});
