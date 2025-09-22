import {
  IProjectMapper,
  MappedProject,
  Mappers,
  Project,
} from '@shared/models';

export class ProjectMapper implements IProjectMapper {
  mapProjects(documents: Project[]): MappedProject[] {
    return documents.map((document) => ({
      id: document._id,
      name: document.name,
      description: document.description,
    }));
  }
}

export type ProjectMapperType = Mappers<ProjectMapper>;
