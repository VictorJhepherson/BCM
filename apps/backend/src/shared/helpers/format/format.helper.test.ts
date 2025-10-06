import { format } from './format.helper';

describe('[helpers] - format', () => {
  describe('[base]', () => {
    it('should format falsy values correctly', () => {
      expect(format.base(null)).toBe('null');
      expect(format.base(undefined)).toBe('undefined');
    });

    it('should format strings correctly', () => {
      expect(format.base('hello')).toBe("'hello'");
    });

    it('should format numbers correctly', () => {
      expect(format.base(123)).toBe('123');
    });

    it('should format booleans correctly', () => {
      expect(format.base(true)).toBe('true');
      expect(format.base(false)).toBe('false');
    });

    it('should format arrays correctly', () => {
      const arr = ['John', 'Doe'];
      expect(format.base(arr)).toBe("[ 'John', 'Doe' ]");
    });

    it('should format objects correctly', () => {
      const obj = { a: 1, b: { c: 2 } };
      expect(format.base(obj, { depth: 2 })).toBe('{ a: 1, b: { c: 2 } }');
    });
  });
});
