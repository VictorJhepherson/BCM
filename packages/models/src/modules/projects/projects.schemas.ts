import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RegexProjects } from './projects.constants';
import { IProject } from './projects.interfaces';

@Schema({ collection: 'projects', timestamps: true, versionKey: false })
export class ProjectEntity implements IProject {
  @Prop({ unique: true, required: true, match: RegexProjects.NAME })
  name: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true, match: RegexProjects.DESCRIPTION })
  description: string;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
