import {
  MethodKeys,
  MethodMock,
  MethodsMap,
  MockType,
} from './method.factory.mocks.types';

export class MockMethodFactory<T> {
  private readonly methods: MethodsMap<T> = {};

  add<K extends MethodKeys<T>>(key: K, value: MethodMock<T, K>): this {
    this.methods[key] = value;
    return this;
  }

  build(): MockType<T> {
    return this.methods as MockType<T>;
  }
}
