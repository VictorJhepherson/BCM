import {
  MethodKeys,
  MethodMock,
  MethodsMap,
  MockType,
} from './factories.mocks.types';

export { MockDataFactory } from './data/data.factory.mocks';

export class MockFactory<T> {
  private readonly methods: MethodsMap<T> = {};

  addMethod<K extends MethodKeys<T>>(
    name: K,
    implementation: MethodMock<T, K>,
  ): this {
    this.methods[name] = implementation;
    return this;
  }

  createMock(): MockType<T> {
    return this.methods as MockType<T>;
  }
}
