import { MockReplace } from './data.factory.mocks.types';

export class MockDataFactory<T extends Record<string, any>, R = T> {
  protected readonly base: Partial<T>;
  protected readonly data: Partial<T> = {};

  constructor(base: Partial<T>) {
    this.base = base;
  }

  select<K extends keyof T, N extends Record<string, any> = T[K]>(
    key: K,
  ): MockDataFactory<N, MockReplace<T, K, N>> {
    if (!(key in this.data)) {
      this.data[key] = {} as T[K];
    }

    return new MockDataFactoryProxy<N, MockReplace<T, K, N>>(
      this.base[key] as N,
      (value: N) => {
        (this.data as T[K])[key] = value;
        return this as unknown as MockDataFactory<T, MockReplace<T, K, N>>;
      },
    );
  }

  addData<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  createMock(): R {
    return { ...this.base, ...this.data } as R;
  }
}

class MockDataFactoryProxy<
  T extends Record<string, any>,
  R,
> extends MockDataFactory<T, R> {
  constructor(
    base: Partial<T>,
    private readonly apply: (value: T) => MockDataFactory<any, R>,
  ) {
    super(base);
  }

  override createMock(): R {
    const mock = super.createMock() as unknown as T;
    return this.apply(mock).createMock();
  }
}
