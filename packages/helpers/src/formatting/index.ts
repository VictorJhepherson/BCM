import { formatCurrency } from '@/formatting/currency/currency-format.helper';
import { formatDate } from '@/formatting/date/date-format.helper';

export const format = {
  date: formatDate,
  currency: formatCurrency,
} as const;
