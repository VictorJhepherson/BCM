export type TMethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never;
}[keyof T];

export type TMethodMock<T, K extends TMethodKeys<T>> = jest.Mock<
  T[K] extends (...args: any) => infer R ? R : never,
  T[K] extends (...args: infer P) => any ? P : never
>;

export type TMethodsMap<T> = Partial<Record<TMethodKeys<T>, jest.Mock>>;
export type TMock<T> = jest.Mocked<T>;
