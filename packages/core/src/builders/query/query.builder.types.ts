import { DeepPartial } from '@shared/models';

export type AddToProps<N> = {
  args: DeepPartial<N>;
};
