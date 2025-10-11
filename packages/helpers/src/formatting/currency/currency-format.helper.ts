import { TFormatConfig, TFormatReturn, TFormatValue } from '@bcm/models';
import { getCurrency } from 'locale-currency';

export const formatCurrency = ({ locale }: TFormatConfig<'currency'>) => {
  return (value: TFormatValue<'currency'>): TFormatReturn<'currency'> => {
    const completed = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: getCurrency(locale) ?? 'USD',
    }).format(value / 100);

    return {
      value,
      formatted: {
        simple: completed.replace(/[^\d.,-]/g, '').trim(),
        completed,
      },
    };
  };
};

export type TCurrencyFormatter = ReturnType<typeof formatCurrency>;
