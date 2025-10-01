import { getConnectionToken } from '@nestjs/mongoose';
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
import { Connection } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { LanguageMapper } from '../mappers/languages.mapper';
import { LanguageRepository } from '../repositories/languages.repository';
import { LanguageDeleteStrategy } from '../strategies';
import { LanguageService } from './languages.service';

const { mockConnection } = mockHelpers.mongo.getMocks();

const { ref, body, data, filter } = new MockDataFactory<LanguageMock>(
  mockData.factory.language,
).build();

describe('[services] - LanguageService', () => {
  const context = {} as MockPropsOf<
    'service',
    LanguageService,
    {
      mapper: LanguageMapper;
      connection: Connection;
      repository: LanguageRepository;
      deleteStrategy: LanguageDeleteStrategy;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LanguageService,
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
          provide: LanguageMapper,
          useFactory: () =>
            new MockMethodFactory<LanguageMapper>()
              .add('mapLanguage', jest.fn())
              .add('mapLanguages', jest.fn())
              .build(),
        },
        {
          provide: LanguageRepository,
          useFactory: () =>
            new MockMethodFactory<LanguageRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('createOne', jest.fn())
              .add('updateOne', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
        {
          provide: LanguageDeleteStrategy,
          useFactory: () =>
            new MockMethodFactory<LanguageDeleteStrategy>()
              .add('softDelete', jest.fn())
              .add('hardDelete', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(LanguageService);
    context.others = {
      mapper: moduleRef.get(LanguageMapper),
      connection: moduleRef.get(getConnectionToken()),
      repository: moduleRef.get(LanguageRepository),
      deleteStrategy: moduleRef.get(LanguageDeleteStrategy),
    };
  });

  beforeEach(() => {
    (context.others.connection.startSession as jest.Mock).mockResolvedValue(
      mockConnection.startSession(),
    );

    (context.others.mapper.mapLanguage as jest.Mock).mockImplementation(
      (data) => data,
    );

    (context.others.mapper.mapLanguages as jest.Mock).mockImplementation(
      (data) => data,
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all languages', async () => {
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

    it('[edge-case] - should get an empty array when has no languages', async () => {
      (context.others.repository.findMany as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll(filter)).toEqual([]);
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a language', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(data);

      expect(await context.service.getById(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a language', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        `Unable to find a language for: ${format.base(ref)}`,
      );
    });
  });

  describe('[addLanguage]', () => {
    it('[success] - should add a language', async () => {
      (context.others.repository.createOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.service.addLanguage(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.createOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addLanguage(body.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editLanguage]', () => {
    it('[success] - should edit a language', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.service.editLanguage(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editLanguage(ref, body.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case] - should failed to edit a language', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.editLanguage(ref, body.edit),
      ).rejects.toThrow(`Unable to find a language for: ${format.base(ref)}`);
    });
  });

  describe('[archiveLanguage]', () => {
    it('[success] - should archive a language', async () => {
      (context.others.deleteStrategy.softDelete as jest.Mock).mockResolvedValue(
        data,
      );

      expect(await context.service.archiveLanguage(ref, body.archive)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.deleteStrategy.softDelete as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.archiveLanguage(ref, body.archive),
      ).rejects.toThrow('REPOSITORY ERROR');
    });
  });

  describe('[deleteLanguage]', () => {
    it('[success] - should delete a language', async () => {
      (context.others.deleteStrategy.hardDelete as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.service.deleteLanguage(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.deleteStrategy.hardDelete as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteLanguage(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
