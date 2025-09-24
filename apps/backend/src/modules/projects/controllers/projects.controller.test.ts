import { Test } from '@nestjs/testing';
import {
  ControllerMockProps,
  MockDataFactory,
  MockMethodFactory,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { ProjectService } from '../services/projects.service';
import { ProjectController } from './projects.controller';

jest.mock('../services/projects.service');

const { dto, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
).build();

describe('[controllers] - ProjectController', () => {
  const context = {} as ControllerMockProps<ProjectController, ProjectService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useFactory: () =>
            new MockMethodFactory<ProjectService>()
              .add('getAll', jest.fn())
              .add('addProject', jest.fn())
              .add('editProject', jest.fn())
              .add('deleteProject', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.service = moduleRef.get(ProjectService);
    context.controller = moduleRef.get(ProjectController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all projects', async () => {
      (context.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getAll()).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[addProject]', () => {
    it('[success] - should added a project', async () => {
      (context.service.addProject as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addProject(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.addProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addProject(dto.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edited a project', async () => {
      (context.service.editProject as jest.Mock).mockResolvedValue(data);

      expect(
        await context.controller.editProject(filter._id, dto.edit),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.service.editProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editProject(filter._id, dto.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[removeProject]', () => {
    it('[success] - should removed a project', async () => {
      (context.service.deleteProject as jest.Mock).mockResolvedValue(undefined);

      expect(await context.controller.deleteProject(filter._id)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.deleteProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.deleteProject(filter._id),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });
});
