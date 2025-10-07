import { ProjectRGX } from '@/modules/projects/models/projects.constants';
import { CommonRGX } from '@/shared/models';

import { IProjectEntity } from '@bcm/models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'projects', timestamps: true, versionKey: false })
export class ProjectEntity implements IProjectEntity {
  @Prop({ unique: true, required: true, match: ProjectRGX.NAME })
  name: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true, default: [], match: CommonRGX.LOCALE })
  locales: string[];

  @Prop({ required: true, match: ProjectRGX.DESCRIPTION })
  description: string;

  @Prop({ type: Object, default: {} })
  attributes: Record<string, string | number | boolean | string[]>;
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectEntity);
