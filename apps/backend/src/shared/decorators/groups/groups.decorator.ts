import { TGroup } from '@bcm/models';
import { SetMetadata } from '@nestjs/common';

export const GROUPS_KEY = 'groups';
export const Groups = (groups: TGroup[]) => SetMetadata(GROUPS_KEY, groups);
