import { TWithId, TWithLean } from '@/common';
import { IProjectEntity } from '@/modules/projects/projects.interfaces';

import { HydratedDocument } from 'mongoose';

export type TProject = HydratedDocument<IProjectEntity>;
export type TFlatProject = TWithLean<IProjectEntity>;

export type TMappedProject = TWithId<TFlatProject>;
