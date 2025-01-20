export type UserIdValidatorUseCase = {
  validateUserId: (id: string) => Promise<void>;
};
