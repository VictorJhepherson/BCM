import {
  IProjectMapper,
  MappedProject,
  Mappers,
  Project,
} from '@shared/models';

export class ProjectMapper implements IProjectMapper {
  mapProjects(projects: Project[]): MappedProject[] {
    return projects.map((project) => ({
      id: project._id,
      name: project.name,
      description: project.description,
    }));
  }
}

export type ProjectMapperType = Mappers<ProjectMapper>;
