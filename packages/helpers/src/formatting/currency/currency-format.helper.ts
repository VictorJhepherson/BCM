import { TFormatOptions, TFormatReturn } from '@bcm/models';

export const formatCurrency = (
  locale: string,
  { value, currency }: TFormatOptions<'currency'>,
): TFormatReturn<'currency'> => {
  const completed = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value / 100);

  return {
    value,
    formatted: { simple: completed.replace(/[^\d.,-]/g, '').trim(), completed },
  };
};
