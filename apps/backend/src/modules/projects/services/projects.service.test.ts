import { Test } from '@nestjs/testing';
import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  ProjectMock,
  ServiceMockProps,
} from '@shared/testing';
import { ProjectRepository } from '../repositories/projects.repository';
import { ProjectService } from './projects.service';

jest.mock('../repositories/projects.repository');
jest.mock('../mappers/projects.mapper', () => ({
  ...jest.requireActual('../mappers/projects.mapper'),
  ProjectMapper: jest.fn().mockImplementation(() => ({
    mapProjects: jest.fn().mockImplementation((data) => data),
  })),
}));

const { dto, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
)
  .select('data')
  .add('_id', mockData.values.mongo._id)
  .build();

describe('[services] - ProjectService', () => {
  const context = {} as ServiceMockProps<ProjectService, ProjectRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: ProjectRepository,
          useFactory: () =>
            new MockMethodFactory<ProjectRepository>()
              .add('getAll', jest.fn())
              .add('addProject', jest.fn())
              .add('editProject', jest.fn())
              .add('removeProject', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(ProjectRepository);
    context.service = moduleRef.get(ProjectService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all projects', async () => {
      (context.repository.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.service.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.getAll as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.getAll()).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[addProject]', () => {
    it('[success] - should added a project', async () => {
      (context.repository.addProject as jest.Mock).mockResolvedValue(data);

      expect(await context.service.addProject(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.addProject as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.addProject(dto.add)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edited a project', async () => {
      (context.repository.editProject as jest.Mock).mockResolvedValue(data);

      expect(await context.service.editProject(filter, dto.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.editProject as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(
        context.service.editProject(filter, dto.edit),
      ).rejects.toThrow('REPOSITORY ERROR');
    });
  });

  describe('[removeProject]', () => {
    it('[success] - should removed a project', async () => {
      (context.repository.removeProject as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.service.removeProject(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.repository.removeProject as jest.Mock).mockRejectedValue(
        new Error('REPOSITORY ERROR'),
      );

      await expect(context.service.removeProject(filter)).rejects.toThrow(
        'REPOSITORY ERROR',
      );
    });
  });
});
