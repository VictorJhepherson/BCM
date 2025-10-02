import { FlatProject } from '@shared/models';
import {
  MockDataFactory,
  MockPropsOf,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { ProjectMapper } from './projects.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<ProjectMock>(mockData.factory.project)
  .select<'data', Required<FlatProject>>('data')
  .build();

describe('[mappers] - ProjectMapper', () => {
  const context = {} as MockPropsOf<'mapper', ProjectMapper>;

  beforeEach(() => {
    context.mapper = new ProjectMapper();
  });

  describe('[mapProject]', () => {
    it('should map a project correctly', () => {
      expect(context.mapper.mapProject(data)).toEqual({
        id: data._id,
        active: data.active,
        name: data.name,
        description: data.description,
        languages: data.languages,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
  });

  describe('[mapProjects]', () => {
    it('should map projects correctly', () => {
      expect(
        context.mapper.mapProjects({
          data: [data],
          sort: { ...sort },
          pagination: { ...pagination, total: 100 },
        }),
      ).toEqual({
        data: expect.arrayContaining([
          {
            id: data._id,
            active: data.active,
            name: data.name,
            description: data.description,
            languages: data.languages,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          },
        ]),
        sort: { by: sort.by, order: sort.order },
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: 5,
        },
      });
    });
  });
});
