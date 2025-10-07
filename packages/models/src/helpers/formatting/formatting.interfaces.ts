export interface IFormatOptionsMap {
  date: {
    value: string | Date;
    style: Intl.DateTimeFormatOptions['dateStyle'];
  };
  currency: {
    value: number;
    currency: Intl.NumberFormatOptions['currency'];
  };
}
