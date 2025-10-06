import { IProjectMapper } from '@/modules/projects/models';

import { TFlatProject, TMappedProject, TWithPagination } from '@bcm/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectMapper implements IProjectMapper {
  mapProject(project: TFlatProject): TMappedProject {
    return {
      id: project._id,
      active: project.active,
      name: project.name,
      description: project.description,
      locales: project.locales,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      attributes: project.attributes,
    };
  }

  mapProjects(
    payload: TWithPagination<TFlatProject>,
  ): TWithPagination<TMappedProject> {
    const { data, sort, pagination } = payload;

    return {
      data: data.map(this.mapProject),
      sort: { by: sort.by, order: sort.order },
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: Math.ceil(pagination.total / pagination.limit),
      },
    };
  }
}
