import { Project } from '@shared/models';
import {
  MapperMockProps,
  MockDataFactory,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { ProjectMapper } from './projects.mapper';

const sort = mockData.values.filter.sort;
const pagination = mockData.values.filter.pagination;

const { data } = new MockDataFactory<ProjectMock>(mockData.factory.project)
  .select<'data', Required<Project>>('data')
  .build();

describe('[mappers] - ProjectMapper', () => {
  const context = {} as MapperMockProps<ProjectMapper>;

  beforeEach(() => {
    context.mapper = new ProjectMapper();
  });

  describe('[mapProject]', () => {
    it('should map a project correctly', () => {
      expect(context.mapper.mapProject(data)).toEqual({
        id: data._id,
        name: data.name,
        description: data.description,
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
          { id: data._id, name: data.name, description: data.description },
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
