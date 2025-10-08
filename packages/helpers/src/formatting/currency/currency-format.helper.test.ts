import { TFormatReturn } from '@bcm/models';
import { formatCurrency } from './currency-format.helper';

describe('[formatting] - formatCurrency', () => {
  it('[BRL][pt-BR] - should return value and formatted values', () => {
    const format = formatCurrency({ locale: 'pt-BR', currency: 'BRL' });
    const currency = format(123456);

    const expected: TFormatReturn<'currency'> = {
      value: 123456,
      formatted: { simple: '1.234,56', completed: 'R$ 1.234,56' },
    };

    expect(currency.value).toBe(expected.value);
    expect(currency.formatted).toMatchObject(currency.formatted);
  });

  it('[USD][en-US] - should return value and formatted values', () => {
    const format = formatCurrency({ locale: 'en-US', currency: 'USD' });
    const currency = format(123456);

    const expected: TFormatReturn<'currency'> = {
      value: 123456,
      formatted: { simple: '1.234.56', completed: '$1.234.56' },
    };

    expect(currency.value).toBe(expected.value);
    expect(currency.formatted).toMatchObject(currency.formatted);
  });
});
