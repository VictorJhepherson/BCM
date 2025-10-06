import { ProjectService } from '@/modules/projects/services/projects.service';
import { LoggerProvider } from '@/shared/providers';

import {
  mockData,
  MockDataFactory,
  MockMethodFactory,
  TMockProject,
  TMockPropsOf,
} from '@bcm/testing';

import { Test } from '@nestjs/testing';
import { ProjectController } from './projects.controller';

const { data, filter, payload } = new MockDataFactory<TMockProject>(
  mockData.project,
).build();

describe('[controllers] - ProjectController', () => {
  const context = {} as TMockPropsOf<
    'controller',
    ProjectController,
    { logger: LoggerProvider; service: ProjectService }
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
      logger: moduleRef.get(LoggerProvider),
      service: moduleRef.get(ProjectService),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should get all projects', async () => {
      (context.others.service.getAll as jest.Mock).mockResolvedValue([data]);

      expect(await context.controller.getAll(filter.default)).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getAll as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getAll(filter.default),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[getById]', () => {
    it('[success] - should get a project', async () => {
      (context.others.service.getById as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.getById(filter.united)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.getById as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.getById(filter.united),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[addProject]', () => {
    it('[success] - should add a project', async () => {
      (context.others.service.addProject as jest.Mock).mockResolvedValue(data);

      expect(await context.controller.addProject(payload.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.addProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.addProject(payload.add),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edit a project', async () => {
      (context.others.service.editProject as jest.Mock).mockResolvedValue(data);

      expect(
        await context.controller.editProject(filter.united, payload.edit),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.editProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.editProject(filter.united, payload.edit),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[archiveProject]', () => {
    it('[success] - should archive a project', async () => {
      (context.others.service.archiveProject as jest.Mock).mockResolvedValue(
        data,
      );

      expect(
        await context.controller.archiveProject(filter.united, payload.archive),
      ).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.archiveProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.archiveProject(filter.united, payload.archive),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });

  describe('[deleteProject]', () => {
    it('[success] - should delete a project', async () => {
      (context.others.service.deleteProject as jest.Mock).mockResolvedValue(
        undefined,
      );

      expect(await context.controller.deleteProject(filter.united)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.others.service.deleteProject as jest.Mock).mockRejectedValue(
        new Error('SERVICE ERROR'),
      );

      await expect(
        context.controller.deleteProject(filter.united),
      ).rejects.toMatchObject({
        referrer: '[projects][controller]',
        error: { message: 'SERVICE ERROR' },
      });
    });
  });
});
