import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ProjectEntity } from '@shared/models';
import {
  MockDataFactory,
  MockMethodFactory,
  ProjectMock,
  RepositoryMockProps,
  mockData,
} from '@shared/testing';
import { Model } from 'mongoose';
import util from 'node:util';
import { ProjectRepository } from './projects.repository';

const { dto, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
).build();

describe('[repositories] - ProjectRepository', () => {
  const context = {} as RepositoryMockProps<
    ProjectRepository,
    Model<ProjectEntity>
  >;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectRepository,
        {
          provide: getModelToken(ProjectEntity.name),
          useFactory: () =>
            new MockMethodFactory<Model<ProjectEntity>>()
              .add('find', jest.fn())
              .add('create', jest.fn())
              .add('deleteOne', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(ProjectEntity.name));
    context.repository = moduleRef.get(ProjectRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[getAll]', () => {
    it('[success] - should return all projects', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([data]),
      });

      expect(await context.repository.getAll()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.getAll()).rejects.toThrow('MODEL ERROR');
    });

    it('[edge-case] - should failed to get all projects when is undefined', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      await expect(context.repository.getAll()).rejects.toThrow(
        'Unable to find all projects.',
      );
    });

    it('[edge-case] - should failed to get all projects when is empty array', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      await expect(context.repository.getAll()).rejects.toThrow(
        'Unable to find all projects.',
      );
    });
  });

  describe('[addProject]', () => {
    it('[success] - should added projects', async () => {
      (context.model.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.addProject(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockReturnValue({
        save: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.addProject(dto.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to add a project', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(undefined);

      await expect(context.repository.addProject(dto.add)).rejects.toThrow(
        `Failed to create a project for: ${util.inspect(dto.add)}`,
      );
    });
  });

  describe('[editProject]', () => {
    it('[success] - should edited a project', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.editProject(filter, dto.edit)).toEqual(
        data,
      );
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        save: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.editProject(filter, dto.edit),
      ).rejects.toThrow('MODEL ERROR');
    });

    it('[edge-case] - should failed to edit a project', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        context.repository.editProject(filter, dto.edit),
      ).rejects.toThrow(`Unable to find a project for: ${filter.id}`);
    });
  });

  describe('[removeProject]', () => {
    it('[success] - should removed a project', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 1,
      });

      expect(await context.repository.removeProject(filter)).toBeFalsy();
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.removeProject(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });

    it('[edge-case] - should failed to remove a project', async () => {
      (context.model.deleteOne as jest.Mock).mockResolvedValue({
        deletedCount: 0,
      });

      await expect(context.repository.removeProject(filter)).rejects.toThrow(
        `Failed to delete a project for: ${filter.id}`,
      );
    });
  });
});
