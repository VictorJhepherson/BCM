export type MockReplace<R, K extends keyof R, N> = Omit<R, K> & Record<K, N>;
