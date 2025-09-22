type ProvidersType = Record<string, any>;

export type MockControllerProps<C, S, P extends ProvidersType = never> = {
  service: S;
  providers: P;
  controller: C;
};

export type MockMapperProps<M> = {
  mapper: M;
};

export type MockRepositoryProps<R, M> = {
  repository: R;
  model: M;
};

export type MockServiceProps<S, R> = {
  service: S;
  repository: R;
};
