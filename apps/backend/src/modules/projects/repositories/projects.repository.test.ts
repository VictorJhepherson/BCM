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
              .add('findByIdAndUpdate', jest.fn())
              .add('findByIdAndDelete', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.model = moduleRef.get(getModelToken(ProjectEntity.name));
    context.repository = moduleRef.get(ProjectRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('[find]', () => {
    it('[success] - should return all projects', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([data]),
      });

      expect(await context.repository.find()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.find()).rejects.toThrow('MODEL ERROR');
    });
  });

  describe('[create]', () => {
    it('[success] - should added projects', async () => {
      (context.model.create as jest.Mock).mockResolvedValue(data);

      expect(await context.repository.create(dto.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.create(dto.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[update]', () => {
    it('[success] - should edited a project', async () => {
      (context.model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.update(filter, dto.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.update(filter, dto.edit)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[delete]', () => {
    it('[success] - should removed a project', async () => {
      (context.model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.delete(filter)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.delete(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
