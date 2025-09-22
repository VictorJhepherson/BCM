export type MethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

export type MethodMock<T, K extends MethodKeys<T>> = jest.Mock<
  T[K] extends (...args: any) => infer R ? R : never,
  T[K] extends (...args: infer P) => any ? P : never
>;

export type MethodsMap<T> = Partial<Record<MethodKeys<T>, jest.Mock>>;
export type MockType<T> = jest.Mocked<T>;
