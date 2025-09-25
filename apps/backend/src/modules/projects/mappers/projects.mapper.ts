import {
  IProjectMapper,
  MappedProject,
  Mappers,
  Project,
  WithPagination,
} from '@shared/models';

export class ProjectMapper implements IProjectMapper {
  mapProjects(payload: WithPagination<Project>): MappedProject {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((project) => ({
        id: project._id,
        name: project.name,
        description: project.description,
      })),
      sort: { by: sort.by, order: sort.order },
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: Math.ceil(pagination.total / pagination.limit),
      },
    };
  }
}

export type ProjectMapperType = Mappers<ProjectMapper>;
