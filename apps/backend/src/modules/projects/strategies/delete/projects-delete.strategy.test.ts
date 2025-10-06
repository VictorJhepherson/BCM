import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
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
      ],
    }).compile();

    context.strategy = moduleRef.get(ProjectDeleteStrategy);
    context.others = {
      logger: moduleRef.get(LoggerProvider),
      project: moduleRef.get(ProjectRepository),
    };
  });

  describe('[softDelete]', () => {
    it('[success] - should apply the update', async () => {
      (context.others.project.updateOne as jest.Mock).mockResolvedValue(data);

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
  });

  describe('[hardDelete]', () => {
    it('[success] - should apply the delete', async () => {
      (context.others.project.deleteOne as jest.Mock).mockResolvedValue({
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

      await expect(
        context.strategy.hardDelete({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[projects][strategy]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });
});
