export type DeleteUserUseCase = {
  delete: (id: string) => Promise<void>;
};
