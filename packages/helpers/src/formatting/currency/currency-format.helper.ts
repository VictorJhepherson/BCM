import { TFormatConfig, TFormatReturn, TFormatValue } from '@bcm/models';

export const formatCurrency = ({
  locale,
  currency,
}: TFormatConfig<'currency'>) => {
  return (value: TFormatValue<'currency'>): TFormatReturn<'currency'> => {
    const completed = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
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
