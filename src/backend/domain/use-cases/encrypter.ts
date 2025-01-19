export type EncrypterUseCase = {
  encrypt: (password: string) => Promise<string>;
  verify: (password: string, passwordHash: string) => Promise<boolean>;
};
