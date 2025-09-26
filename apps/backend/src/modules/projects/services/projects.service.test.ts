import { Test } from '@nestjs/testing';
import { format } from '@shared/helpers';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ProjectMock,
  ServiceMockProps,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { ProjectRepository } from '../repositories/projects.repository';
import { ProjectService } from './projects.service';

jest.mock('../mappers/projects.mapper', () => ({
  ...jest.requireActual('../mappers/projects.mapper'),
  ProjectMapper: jest.fn().mockImplementation(() => ({
    mapProject: jest.fn().mockImplementation((data) => data),
    mapProjects: jest.fn().mockImplementation((data) => data),
  })),
}));

const { ref, body, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
).build();

describe('[services] - ProjectService', () => {
  const context = {} as ServiceMockProps<ProjectService, ProjectRepository>;

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
          provide: ProjectRepository,
          useFactory: () =>
            new MockMethodFactory<ProjectRepository>()
              .add('findMany', jest.fn())
              .add('findOne', jest.fn())
              .add('create', jest.fn())
              .add('update', jest.fn())
              .add('deleteOne', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(ProjectRepository);
    context.service = moduleRef.get(ProjectService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all projects', async () => {
      (context.repository.findMany as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getAll(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findMany as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should get an empty array when has no projects', async () => {
      (context.repository.findMany as jest.Mock).mockResolvedValue([]);

      expect(await context.service.getAll(filter)).toEqual([]);
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a project', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(data);

      expect(await context.service.getById(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.findOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getById(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to get a project', async () => {
      (context.repository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.getById(ref)).rejects.toThrow(
        `Unable to find a project for: ${format.base(ref)}`,
      );
    });
  });

  describe('[addProject]', () => {
    it('[success] - should add a project', async () => {
      (context.repository.create as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addProject(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.create as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addProject(body.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edit a project', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editProject(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.update as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.editProject(ref, body.edit)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to edit a project', async () => {
      (context.repository.update as jest.Mock).mockResolvedValue(undefined);

      await expect(context.service.editProject(ref, body.edit)).rejects.toThrow(
        `Unable to find a project for: ${format.base(ref)}`,
      );
    });
  });

  describe('[deleteProject]', () => {
    it('[success] - should delete a project', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.service.deleteProject(ref)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.deleteOne as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.deleteProject(ref)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });

    it('[edge-case] - should failed to delete a project', async () => {
      (context.repository.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.service.deleteProject(ref)).rejects.toThrow(
        `Failed to delete a project for: ${format.base(ref)}`,
      );
    });
  });
});
