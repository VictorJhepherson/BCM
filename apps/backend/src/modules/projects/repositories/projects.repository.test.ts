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
import { LoggerProvider } from '../../../providers';
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

  describe('[findMany]', () => {
    it('[success] - should return all projects', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([data]),
      });

      expect(await context.repository.findMany()).toEqual([data]);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.findMany()).rejects.toThrow(
        'MODEL ERROR',
      );
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
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.update(filter, dto.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.update(filter, dto.edit)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should removed a project', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteOne(filter)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteOne(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
