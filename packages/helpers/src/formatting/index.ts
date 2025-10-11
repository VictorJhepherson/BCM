import {
  formatCurrency,
  type TCurrencyFormatter,
} from '@/formatting/currency/currency-format.helper';
import {
  formatDate,
  type TDateFormatter,
} from '@/formatting/date/date-format.helper';

export const format = {
  date: formatDate,
  currency: formatCurrency,
} as const;

export type TFormatting = { date: TDateFormatter; currency: TCurrencyFormatter };