export interface UserUniqueEmailValidatorUseCase {
  validate: (email: string) => Promise<void>;
}
