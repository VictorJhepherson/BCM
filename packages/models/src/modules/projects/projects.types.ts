import { HydratedDocument, Types } from 'mongoose';
import { IProject } from './projects.interfaces';
import { ProjectEntity } from './projects.schemas';

export type Project = HydratedDocument<ProjectEntity>;

export type ProjectFilter = {
  _id: Types.ObjectId;
};

export type MappedProject = IProject & {
  id: Types.ObjectId;
};
