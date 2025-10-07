import { TFormatReturn } from '@bcm/models';
import { formatDate as format } from './date-format.helper';

describe('[formatting] - formatDate', () => {
  describe('[en-US] - ISO String', () => {
    const mocks = { date: '2025-10-07T18:47:32.123Z' };

    it('[short] - should return value and formatted values', () => {
      const date = format('en-US', { value: mocks.date, style: 'short' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: { simple: '10/7/25', completed: '10/7/25' },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[medium] - should return value and formatted values', () => {
      const date = format('en-US', { value: mocks.date, style: 'medium' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: { simple: 'Oct 7, 2025', completed: 'Oct 7, 2025' },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[long] - should return value and formatted values', () => {
      const date = format('en-US', { value: mocks.date, style: 'long' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: { simple: 'October 7, 2025', completed: 'October 7, 2025' },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[full] - should return value and formatted values', () => {
      const date = format('en-US', { value: mocks.date, style: 'full' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: {
          simple: 'Tuesday, October 7, 2025',
          completed: 'Tuesday, October 7, 2025',
        },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });
  });

  describe('[pt-BR] - Date', () => {
    const mocks = { date: new Date('2025-10-07T18:47:32.123Z') };

    it('[short] - should return value and formatted values', () => {
      const date = format('pt-BR', { value: mocks.date, style: 'short' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: { simple: '07/10/2025', completed: '07/10/2025' },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[medium] - should return value and formatted values', () => {
      const date = format('pt-BR', { value: mocks.date, style: 'medium' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: {
          simple: '7 de out. de 2025',
          completed: '7 de out. de 2025',
        },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[long] - should return value and formatted values', () => {
      const date = format('pt-BR', { value: mocks.date, style: 'long' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: {
          simple: '7 de outubro de 2025',
          completed: '7 de outubro de 2025',
        },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });

    it('[full] - should return value and formatted values', () => {
      const date = format('pt-BR', { value: mocks.date, style: 'full' });
      const expected: TFormatReturn<'date'> = {
        value: mocks.date,
        formatted: {
          simple: 'terça-feira, 7 de outubro de 2025',
          completed: 'terça-feira, 7 de outubro de 2025',
        },
      };

      expect(date.value).toBe(expected.value);
      expect(date.formatted).toMatchObject(expected.formatted);
    });
  });
});
