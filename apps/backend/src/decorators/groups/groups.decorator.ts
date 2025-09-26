import { SetMetadata } from '@nestjs/common';
import { Group } from '@shared/models';

export const GROUPS_KEY = 'groups';
export const Groups = (groups: Group[]) => SetMetadata(GROUPS_KEY, groups);
