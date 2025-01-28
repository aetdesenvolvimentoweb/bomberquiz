export type DateValidatorUseCase = {
  isValid: (date: Date) => boolean;
  isBirthdateValid: (birthdate: Date) => boolean;
};
