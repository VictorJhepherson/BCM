import { ProjectMapper } from '@/modules/projects/mappers/projects.mapper';
import { ProjectRepository } from '@/modules/projects/repositories/projects.repository';
import { ProjectDeleteStrategy } from '@/modules/projects/strategies';
import { format } from '@/shared/helpers';
import { LoggerProvider } from '@/shared/providers';

import {
  mockData,
  MockDataFactory,
  mockHelpers,
  MockMethodFactory,
  TMockProject,
  TMockPropsOf,
} from '@bcm/testing';

import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { ProjectService } from './projects.service';

const { mockConnection } = mockHelpers.database.getMocks();
const { data, filter, payload } = new MockDataFactory<TMockProject>(
  mockData.project,
).build();

describe('[services] - ProjectService', () => {
  const context = {} as TMockPropsOf<
    'service',
    ProjectService,
    {
      mapper: ProjectMapper;
      connection: Connection;
      repository: ProjectRepository;
      deleteStrategy: ProjectDeleteStrategy;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectService,
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
          provide: ProjectMapper,
          useFactory: () =>
            new MockMethodFactory<ProjectMapper>()
              .add('mapProject', jest.fn())
              .add('mapProjects', jest.fn())
              .build(),
        },
        {
          provide: ProjectRepository,
          useFactory: () =>
            new MockMethodFactory<ProjectRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('createOne', jest.fn())
              .add('updateOne', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
        {
          provide: ProjectDeleteStrategy,
          useFactory: () =>
            new MockMethodFactory<ProjectDeleteStrategy>()
              .add('softDelete', jest.fn())
              .add('hardDelete', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(ProjectService);
    context.others = {
      mapper: moduleRef.get(ProjectMapper),
      connection: moduleRef.get(getConnectionToken()),
      repository: moduleRef.get(ProjectRepository),
      deleteStrategy: moduleRef.get(ProjectDeleteStrategy),
    };
  });

  beforeEach(() => {
    (context.others.connection.startSession as jest.Mock).mockResolvedValue(
      mockConnection.startSession(),
    );

    (context.others.mapper.mapProject as jest.Mock).mockImplementation(
      (data) => data,
    );

    (context.others.mapper.mapProjects as jest.Mock).mockImplementation(
      (data) => data,
    );
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all projects', async () => {
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
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should get an empty array when has no projects', async () => {
      (context.others.repository.findMany as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll({ filter: filter.default })).toEqual(
        [],
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a project', async () => {
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
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should failed to get a project', async () => {
      (context.others.repository.findOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.getById({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: {
          message: `Unable to find a project for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[addProject]', () => {
    it('[success] - should add a project', async () => {
      (context.others.repository.createOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.addProject({ payload: payload.add }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.repository.createOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.addProject({ payload: payload.add }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edit a project', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.editProject({
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
        context.service.editProject({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });

    it('[edge-case] - should failed to edit a project', async () => {
      (context.others.repository.updateOne as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.service.editProject({
          filter: filter.united,
          payload: payload.edit,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: {
          message: `Unable to find a project for: ${format.base(filter.united)}`,
        },
      });
    });
  });

  describe('[archiveProject]', () => {
    it('[success] - should archive a project', async () => {
      (context.others.deleteStrategy.softDelete as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.service.archiveProject({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.deleteStrategy.softDelete as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.archiveProject({
          filter: filter.united,
          payload: payload.archive,
        }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });

  describe('[deleteProject]', () => {
    it('[success] - should delete a project', async () => {
      (context.others.deleteStrategy.hardDelete as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(
        await context.service.deleteProject({ filter: filter.united }),
      ).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.deleteStrategy.hardDelete as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.deleteProject({ filter: filter.united }),
      ).rejects.toMatchObject({
        referrer: '[projects][service]',
        error: { message: 'REPOSITORY ERROR' },
      });
    });
  });
});
