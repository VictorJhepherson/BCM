import { TBaseType, TMockReplace } from './data.factory.mocks.types';

export class MockDataFactory<
  T extends TBaseType,
  TRoot = T,
  TCurrent extends TBaseType = T,
> {
  private readonly base: Partial<TCurrent> = {};
  private readonly overrides: Partial<TCurrent> = {};

  constructor(defaults: Partial<TCurrent> = {}) {
    this.base = { ...defaults };
  }

  select<K extends keyof TCurrent, N extends TBaseType = TCurrent[K]>(
    key: K,
  ): MockDataFactory<N, TMockReplace<TRoot, K, N>, N> {
    const factory = new MockDataFactory<N, TMockReplace<TRoot, K, N>>(
      this.base[key] as Partial<TCurrent[K]>,
    );

    const build = factory.build.bind(factory);

    factory.build = () => {
      (this.overrides as TCurrent[K])[key] = build();

      return {
        ...this.base,
        ...this.overrides,
      } as unknown as TMockReplace<TRoot, K, N>;
    };

    return factory;
  }

  add<K extends keyof TCurrent>(key: K, value: TCurrent[K]): this {
    this.overrides[key] = value;
    return this;
  }

  build(): TRoot {
    return { ...this.base, ...this.overrides } as TRoot;
  }
}
