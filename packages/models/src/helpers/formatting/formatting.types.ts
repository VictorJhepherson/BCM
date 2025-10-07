import { IFormatOptionsMap } from '@/helpers/formatting';

export type TFormatTypes = 'date' | 'currency';
export type TFormatOptions<T extends TFormatTypes> = IFormatOptionsMap[T];

export type TFormatReturn<T extends TFormatTypes> = {
  value: IFormatOptionsMap[T]['value'];
  formatted: { simple: string; completed: string };
};
