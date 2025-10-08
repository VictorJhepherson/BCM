export interface IFormatMap {
  date: {
    value: string | Date;
    config: { locale: string };
    options: { style: Intl.DateTimeFormatOptions['dateStyle'] };
  };
  currency: {
    value: number;
    config: { locale: string; currency: Intl.NumberFormatOptions['currency'] };
  };
}
