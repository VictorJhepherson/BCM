import {
  TMethodKeys,
  TMethodMock,
  TMethodsMap,
  TMock,
} from './method.factory.mocks.types';

export class MockMethodFactory<T> {
  private readonly methods: TMethodsMap<T> = {};

  add<K extends TMethodKeys<T>>(key: K, value: TMethodMock<T, K>): this {
    this.methods[key] = value;
    return this;
  }

  build(): TMock<T> {
    return this.methods as TMock<T>;
  }
}
