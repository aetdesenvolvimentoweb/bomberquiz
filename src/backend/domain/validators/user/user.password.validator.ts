export interface UserPasswordValidatorUseCase {
  validate: (password: string) => void;
}
