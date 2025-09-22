import { Project } from '@shared/models';
import {
  MapperMockProps,
  MockDataFactory,
  ProjectMock,
  mockData,
} from '@shared/testing';
import { ProjectMapper } from './projects.mapper';

const { data } = new MockDataFactory<ProjectMock>(mockData.factory.project)
  .select<'data', Required<Project>>('data')
  .add('_id', mockData.values.mongo._id)
  .build();

describe('[mappers] - ProjectMapper', () => {
  const context = {} as MapperMockProps<ProjectMapper>;

  beforeEach(() => {
    context.mapper = new ProjectMapper();
  });

  describe('[mapProjects]', () => {
    it('should map projects correctly', () => {
      expect(context.mapper.mapProjects([data])).toEqual(
        expect.arrayContaining([
          {
            id: data._id,
            name: data.name,
            description: data.description,
          },
        ]),
      );
    });
  });
});
