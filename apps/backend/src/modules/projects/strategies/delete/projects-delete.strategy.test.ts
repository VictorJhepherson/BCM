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
import { LoggerProvider } from '../../../../providers';
import { TranslationRepository } from '../../../translations/repositories/translations.repository';
import { ProjectRepository } from '../../repositories/projects.repository';
import { ProjectDeleteStrategy } from './projects-delete.strategy';

const { mockConnection } = mockHelpers.mongo.getMocks();

const { ref, body, data } = new MockDataFactory<LanguageMock>(
  mockData.factory.project,
).build();

describe('[strategies] - ProjectDeleteStrategy', () => {
  const context = {} as MockPropsOf<
    'strategy',
    ProjectDeleteStrategy,
    {
      logger: LoggerProvider;
      connection: Connection;
      project: ProjectRepository;
      translation: TranslationRepository;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectDeleteStrategy,
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
          provide: ProjectRepository,
          useFactory: () =>
            new MockMethodFactory<ProjectRepository>()
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

    context.strategy = moduleRef.get(ProjectDeleteStrategy);
    context.others = {
      logger: moduleRef.get(LoggerProvider),
      project: moduleRef.get(ProjectRepository),
      connection: moduleRef.get(getConnectionToken()),
      translation: moduleRef.get(TranslationRepository),
    };
  });

  describe('[softDelete]', () => {
    beforeEach(() => {
      (context.others.connection.startSession as jest.Mock).mockResolvedValue(
        mockConnection.startSession(),
      );
    });

    it('[success] - should apply the update', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      expect(await context.strategy.softDelete(ref, body.archive)).toEqual(
        data,
      );
    });

    it('[failure][updateOne] - should handler an error', async () => {
      (context.others.project.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[failure][updateMany] - should handler an error', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow('REPOSITORY ERROR');
    });

    it('[edge-case][updateOne] - should failed to archive a project', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow(`Unable to archive a project for: ${format.base(ref)}`);
    });

    it('[edge-case][updateMany] - should failed to archive translations', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        context.strategy.softDelete(ref, body.archive),
      ).rejects.toThrow(
        `Unable to archive translations by project: ${format.base(ref)}`,
      );
    });
  });

  describe('[hardDelete]', () => {
    beforeEach(() => {
      (context.others.connection.startSession as jest.Mock).mockResolvedValue(
        mockConnection.startSession(),
      );
    });

    it('[success] - should apply the delete', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.strategy.hardDelete(ref)).toBeFalsy();
    });

    it('[failure][deleteOne] - should handler an error', async () => {
      (context.others.project.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[failure][deleteMany] - should handler an error', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case][deleteOne] - should failed to delete a project', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        `Failed to delete a project for: ${format.base(ref)}`,
      );
    });

    it('[edge-case][deleteMany] - should failed to delete translations', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.strategy.hardDelete(ref)).rejects.toThrow(
        `Failed to delete translations by project: ${format.base(ref)}`,
      );
    });
  });
});
