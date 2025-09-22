import { Project } from '@shared/models';
import {
  MockDataFactory,
  MockMapperProps,
  MockProject,
  mockData,
} from '@shared/testing';
import { ProjectMapper } from './projects.mapper';

const { data } = new MockDataFactory<MockProject>(mockData.factory.project)
  .select<'data', Required<Project>>('data')
  .addData('_id', mockData.values.mongo._id)
  .createMock();

describe('[mappers] - ProjectMapper', () => {
  const context = {} as MockMapperProps<ProjectMapper>;

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
