import { Test } from '@nestjs/testing';
import {
  MockControllerProps,
  MockDataFactory,
  MockFactory,
  MockProject,
  mockData,
} from '@shared/testing';
import { ProjectService } from '../services/projects.service';
import { ProjectController } from './projects.controller';

jest.mock('../services/projects.service');

const { dto, data, filter } = new MockDataFactory<MockProject>(
  mockData.factory.project,
)
  .select('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[controllers] - ProjectController', () => {
  const context = {} as MockControllerProps<ProjectController, ProjectService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useFactory: () =>
            new MockFactory<ProjectService>()
              .addMethod('getAll', jest.fn())
              .addMethod('addProject', jest.fn())
              .addMethod('editProject', jest.fn())
              .addMethod('removeProject', jest.fn())
              .createMock(),
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

      expect(await context.controller.editProject(filter.id, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.service.editProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editProject(filter.id, dto.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[removeProject]', () => {
    it('[success] - should removed a project', async () => {
      (context.service.removeProject as jest.Mock).mockResolvedValue(undefined);

      expect(await context.controller.removeProject(filter.id)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.service.removeProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.removeProject(filter.id)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });
});
