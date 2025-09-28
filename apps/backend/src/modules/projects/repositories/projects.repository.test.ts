import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { ProjectEntity } from '@shared/models';
import {
  MockDataFactory,
  MockMethodFactory,
  MockPropsOf,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { Model } from 'mongoose';
import { LoggerProvider } from '../../../providers';
import { ProjectRepository } from './projects.repository';

const { ref, body, data, filter } = new MockDataFactory<ProjectMock>(
  mockData.factory.project,
).build();

describe('[repositories] - ProjectRepository', () => {
  const context = {} as MockPropsOf<
    'repository',
    ProjectRepository,
    {
      model: Model<ProjectEntity>;
    }
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
              .add('findOne', jest.fn())
              .add('create', jest.fn())
              .add('deleteOne', jest.fn())
              .add('countDocuments', jest.fn())
              .add('findOneAndUpdate', jest.fn())
              .build(),
        },
      ],
    }).compile();

    context.repository = moduleRef.get(ProjectRepository);
    context.others = {
      model: moduleRef.get(getModelToken(ProjectEntity.name)),
    };
  });

  afterEach(() => jest.clearAllMocks());

  describe('[findOne]', () => {
    it('[success] - should get a project', async () => {
      (context.others.model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.findOne(ref)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.findOne(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[findMany]', () => {
    it('[success] - should get all projects', async () => {
      (context.others.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.others.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([data]),
            }),
          }),
        }),
      });

      expect(await context.repository.findMany(filter)).toEqual({
        data: [data],
        sort: mockData.values.filter.sort,
        pagination: { ...mockData.values.filter.pagination, total: 100 },
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(100),
      });

      (context.others.model.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
            }),
          }),
        }),
      });

      await expect(context.repository.findMany(filter)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[createOne]', () => {
    it('[success] - should add projects', async () => {
      (context.others.model.create as jest.Mock).mockResolvedValue(data);

      expect(await context.repository.createOne(body.add)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.create as jest.Mock).mockRejectedValue(
        new Error('MODEL ERROR'),
      );

      await expect(context.repository.createOne(body.add)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });

  describe('[updateOne]', () => {
    it('[success] - should edit a project', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(data),
      });

      expect(await context.repository.updateOne(ref, body.edit)).toEqual(data);
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.findOneAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(
        context.repository.updateOne(ref, body.edit),
      ).rejects.toThrow('MODEL ERROR');
    });
  });

  describe('[deleteOne]', () => {
    it('[success] - should delete a project', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      expect(await context.repository.deleteOne(ref)).toEqual({
        deletedCount: 1,
      });
    });

    it('[failure] - should handle an error', async () => {
      (context.others.model.deleteOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('MODEL ERROR')),
      });

      await expect(context.repository.deleteOne(ref)).rejects.toThrow(
        'MODEL ERROR',
      );
    });
  });
});
