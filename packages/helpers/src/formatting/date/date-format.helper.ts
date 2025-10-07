import { TFormatOptions, TFormatReturn } from '@bcm/models';

export const formatDate = (
  locale: string,
  { value, style }: TFormatOptions<'date'>,
): TFormatReturn<'date'> => {
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle: style,
  }).format(new Date(value));

  return { value, formatted: { simple: formatted, completed: formatted } };
};
