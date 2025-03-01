export type DateFnsModule = {
  isValid: (date: Date | number) => boolean;
  subYears: (date: Date | number, amount: number) => Date;
};
