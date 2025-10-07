import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { TranslationRepository } from '@/modules/translations/repositories/translations.repository';
import { format } from '@/shared/helpers';
import { LoggerProvider } from '@/shared/providers';

import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  TMockProject,
  TMockPropsOf,
} from '@bcm/testing';

import { Test } from '@nestjs/testing';
import { ProjectDeleteStrategy } from './projects-delete.strategy';

const { data, filter, payload } = new MockDataFactory<TMockProject>(
  mockData.project,
).build();

describe('[strategies] - ProjectDeleteStrategy', () => {
  const context = {} as TMockPropsOf<
    'strategy',
    ProjectDeleteStrategy,
    {
      logger: LoggerProvider;
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
      translation: moduleRef.get(TranslationRepository),
    };
  });

  describe('[softDelete]', () => {
    it('[success] - should apply the update', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      expect(
        await context.strategy.softDelete({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).toEqual(data);
    });

    it('[failure][updateOne] - should handler an error', async () => {
      (context.others.project.updateOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await expect(
        context.strategy.softDelete({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[failure][updateMany] - should handler an error', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);
      (context.others.translation.updateMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.softDelete({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case][updateOne] - should failed to archive a project', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 1,
      });

      await expect(
        context.strategy.softDelete({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: {
          message: `Unable to archive a project for: ${format.base(filter.united)}`,
        },
      });
    });

    it('[edge-case][updateMany] - should failed to archive a project', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);

      (context.others.translation.updateMany as jest.Mock).mockResolvedValue({
        matchedCount: 1,
        modifiedCount: 0,
      });

      await expect(
        context.strategy.softDelete({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: {
          message: `Unable to archive translations for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[hardDelete]', () => {
    it('[success] - should apply the delete', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(
        await context.strategy.hardDelete({ filter: filter.united }),
      ).toBeFalsy();
    });

    it('[failure][deleteOne] - should handler an error', async () => {
      (context.others.project.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      (context.others.translation.deleteMany as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      await expect(
        context.strategy.hardDelete({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[failure][deleteMany] - should handler an error', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      (context.others.translation.deleteMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.strategy.hardDelete({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });
});
