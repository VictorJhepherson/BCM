import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RegexProjects } from './projects.constants';
import { IProject } from './projects.interfaces';

@Schema({ collection: 'projects', timestamps: true, versionKey: false })
export class ProjectEntity implements IProject {
  @Prop({ unique: true, required: true, match: RegexProjects.NAME })
  readonly name: string;

  @Prop({ required: true })
  readonly active: boolean;

  @Prop({ required: true, match: RegexProjects.LANGUAGE })
  readonly languages: string[];

  @Prop({ required: true, match: RegexProjects.DESCRIPTION })
  readonly description: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
