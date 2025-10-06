import { TransformerCollection } from './transformer.collection';

describe('[collection] - TransformerCollection', () => {
  const mockFn = jest.fn().mockImplementation((n: number) => n * 2);
  const mockFnToString = jest
    .fn()
    .mockImplementation((n: number) => n.toString());

  describe('[get]', () => {
    it('should initialize with an empty array if no transformers are provided', () => {
      const collection = new TransformerCollection<number, number>();
      expect(collection.get()).toEqual([]);
    });

    it('should initialize with the provided array of transformers', () => {
      const initial = [mockFn, mockFnToString];
      const collection = new TransformerCollection<number, number>(initial);

      expect(collection.get()).toEqual(initial);
    });
  });

  describe('[add]', () => {
    it('should return a new instance of TransformerCollection', () => {
      const initial = new TransformerCollection<number, number>();
      const collection = initial.add(mockFn);

      expect(collection).not.toBe(initial);
    });

    it('should maintain existing transformers in the new collection', () => {
      const initial = new TransformerCollection<number, number>([mockFn]);

      const collection = initial.add(mockFnToString);
      const transformers = collection.get();

      expect(transformers).toHaveLength(2);
      expect(transformers[0]).toBe(mockFn);
      expect(transformers[1]).toBe(mockFnToString);
    });
  });
});
