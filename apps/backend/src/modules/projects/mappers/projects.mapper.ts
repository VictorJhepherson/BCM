import {
  IProjectMapper,
  MappedProject,
  Mappers,
  Project,
  ProjectPayload,
  WithPagination,
} from '@shared/models';

export class ProjectMapper implements IProjectMapper {
  mapProject(project: Project): ProjectPayload {
    return {
      id: project._id,
      name: project.name,
      description: project.description,
    };
  }

  mapProjects(payload: WithPagination<Project>): MappedProject {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((project) => this.mapProject(project)),
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
