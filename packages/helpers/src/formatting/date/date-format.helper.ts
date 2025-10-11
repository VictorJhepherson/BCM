import {
  TFormatConfig,
  TFormatOptions,
  TFormatReturn,
  TFormatValue,
} from '@bcm/models';

export const formatDate = ({ locale }: TFormatConfig<'date'>) => {
  return (
    original: TFormatValue<'date'>,
    { style }: TFormatOptions<'date'>,
  ): TFormatReturn<'date'> => {
    const formatted = new Intl.DateTimeFormat(locale, {
      dateStyle: style,
    }).format(new Date(original));

    const value = original instanceof Date ? original.toISOString() : original;
    return { value, formatted: { simple: formatted, completed: formatted } };
  };
};

export type TDateFormatter = ReturnType<typeof formatDate>;
