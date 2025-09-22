import { BaseType, MockReplace } from './data.factory.mocks.types';

export class MockDataFactory<
  T extends BaseType,
  Root = T,
  Current extends BaseType = T,
> {
  private readonly base: Partial<Current> = {};
  private readonly overrides: Partial<Current> = {};

  constructor(defaults: Partial<Current> = {}) {
    this.base = { ...defaults };
  }

  select<K extends keyof Current, N extends BaseType = Current[K]>(
    key: K,
  ): MockDataFactory<N, MockReplace<Root, K, N>, N> {
    const factory = new MockDataFactory<N, MockReplace<Root, K, N>>(
      this.base[key] as Partial<Current[K]>,
    );

    const build = factory.build.bind(factory);

    factory.build = () => {
      (this.overrides as Current[K])[key] = build();

      return {
        ...this.base,
        ...this.overrides,
      } as unknown as MockReplace<Root, K, N>;
    };

    return factory;
  }

  add<K extends keyof Current>(key: K, value: Current[K]): this {
    this.overrides[key] = value;
    return this;
  }

  build(): Root {
    return { ...this.base, ...this.overrides } as Root;
  }
}
