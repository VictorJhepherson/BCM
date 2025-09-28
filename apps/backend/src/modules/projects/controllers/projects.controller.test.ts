import { Test } from '@nestjs/testing';
import {
  MockDataFactory,
  MockMethodFactory,
  MockPropsOf,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { LoggerProvider } from '../../../providers';
import { ProjectService } from '../services/projects.service';
import { ProjectController } from './projects.controller';

const { ref, body, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
).build();

describe('[controllers] - ProjectController', () => {
  const context = {} as MockPropsOf<
    'controller',
    ProjectController,
    {
      service: ProjectService;
    }
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
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
          provide: ProjectService,
          useFactory: () =>
            new MockMethodFactory<ProjectService>()
              .add('getAll', jest.fn())
              .add('getById', jest.fn())
              .add('addProject', jest.fn())
              .add('editProject', jest.fn())
              .add('archiveProject', jest.fn())
              .add('deleteProject', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.controller = moduleRef.get(ProjectController);
    context.others = {
      service: moduleRef.get(ProjectService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all projects', async () => {
      (context.others.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll(filter)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getAll(filter)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a project', async () => {
      (context.others.service.getById as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.getById(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getById as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.getById(ref)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[addProject]', () => {
    it('[success] - should add a project', async () => {
      (context.others.service.addProject as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addProject(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.addProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.addProject(body.add)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edit a project', async () => {
      (context.others.service.editProject as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.editProject(ref._id, body.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.editProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editProject(ref._id, body.edit),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[archiveProject]', () => {
    it('[success] - should archive a project', async () => {
      (context.others.service.archiveProject as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.controller.archiveProject(ref._id, body.archive),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.archiveProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.archiveProject(ref._id, body.archive),
      ).rejects.toThrow('SERVICE ERROR');
    });
  });

  describe('[deleteProject]', () => {
    it('[success] - should delete a project', async () => {
      (context.others.service.deleteProject as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.controller.deleteProject(ref._id)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.deleteProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(context.controller.deleteProject(ref._id)).rejects.toThrow(
        'SERVICE ERROR',
      );
    });
  });
});
