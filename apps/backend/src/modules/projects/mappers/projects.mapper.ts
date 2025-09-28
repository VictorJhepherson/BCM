import {
  FlatProject,
  IProjectMapper,
  MappedProject,
  Mappers,
  ProjectPayload,
  WithPagination,
} from '@shared/models';

export class ProjectMapper implements IProjectMapper {
  mapProject(project: FlatProject): ProjectPayload {
    return {
      id: project._id,
      name: project.name,
      active: project.active,
      description: project.description,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  mapProjects(payload: WithPagination<FlatProject>): MappedProject {
    const { data, sort, pagination } = payload;

    return {
      data: data.map((project: FlatProject) => this.mapProject(project)),
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
