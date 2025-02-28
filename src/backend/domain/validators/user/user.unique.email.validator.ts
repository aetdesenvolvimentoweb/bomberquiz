export interface UserUniqueEmailValidatorUseCase {
  validate: (data: { id?: string; email: string }) => Promise<void>;
}
