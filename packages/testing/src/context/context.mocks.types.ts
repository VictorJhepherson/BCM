type ProvidersType = Record<string, any>;

export type ControllerMockProps<C, S, P extends ProvidersType = never> = {
  service: S;
  providers: P;
  controller: C;
};

export type MapperMockProps<M> = {
  mapper: M;
};

export type RepositoryMockProps<R, M> = {
  repository: R;
  model: M;
};

export type ServiceMockProps<S, R> = {
  service: S;
  repository: R;
};
