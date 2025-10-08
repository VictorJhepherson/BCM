import { TPrimitiveOnly } from '@/common';
import { IFormatMap } from '@/helpers/formatting';

export type TFormatTypes = 'date' | 'currency';

export type TFormatValue<T extends TFormatTypes> = IFormatMap[T]['value'];
export type TFormatConfig<T extends TFormatTypes> = IFormatMap[T]['config'];
export type TFormatOptions<T extends TFormatTypes> =
  'options' extends keyof IFormatMap[T] ? IFormatMap[T]['options'] : {};

export type TFormatReturn<T extends TFormatTypes> = {
  value: TPrimitiveOnly<IFormatMap[T]['value']>;
  formatted: { simple: string; completed: string };
};
