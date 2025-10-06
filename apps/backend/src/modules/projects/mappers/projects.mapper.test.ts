import { TFlatProject } from '@bcm/models';
import {
  MockDataFactory,
  TMockProject,
  TMockPropsOf,
  mockData,
} from '@bcm/testing';

import { ProjectMapper } from './projects.mapper';

const sort = mockData.filter.sort;
const pagination = mockData.filter.pagination;

const { data } = new MockDataFactory<TMockProject>(mockData.project)
  .select<'data', Required<TFlatProject>>('data')
  .build();

describe('[mappers] - ProjectMapper', () => {
  const context = {} as TMockPropsOf<'mapper', ProjectMapper>;

  beforeEach(() => {
    context.mapper = new ProjectMapper();
  });

  describe('[mapProject]', () => {
    it('should map a project correctly', () => {
      expect(context.mapper.mapProject(data)).toEqual({
        id: data._id,
        name: data.name,
        active: data.active,
        locales: data.locales,
        description: data.description,
        attributes: data.attributes,
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
            name: data.name,
            active: data.active,
            locales: data.locales,
            description: data.description,
            attributes: data.attributes,
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
