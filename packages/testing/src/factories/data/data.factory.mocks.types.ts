export type BaseType = Record<string, any>;
export type MockReplace<R, K extends keyof any, N> = Omit<R, K> & Record<K, N>;

export class MockDataFactory<T extends BaseType, Root = T> {
  private readonly base: Partial<T> = {};
  private readonly overrides: Partial<T> = {};

  constructor(defaults: Partial<T> = {}) {
    this.base = { ...defaults };
  }

  select<K extends keyof T, N extends BaseType = T[K]>(
    key: K,
  ): MockDataFactory<N, MockReplace<T, K, N>> {
    return new MockDataFactory<N, MockReplace<T, K, N>>(
      this.base[key] as Partial<T[K]>,
    );
  }

  add<K extends keyof T>(key: K, value: T[K]): this {
    this.overrides[key] = value;
    return this;
  }

  build(): Root {
    return { ...this.base, ...this.overrides } as Root;
  }
}
