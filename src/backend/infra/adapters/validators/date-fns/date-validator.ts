import { differenceInYears, isDate } from "date-fns";
import { DateValidatorUseCase } from "@/backend/domain/use-cases";

export class DateFnsDateValidatorAdapter implements DateValidatorUseCase {
  public readonly isValid = (date: Date): boolean => {
    return isDate(date);
  };

  public readonly isAdult = (birthdate: Date): boolean => {
    this.isValid(birthdate);
    return differenceInYears(new Date(Date.now()), birthdate) >= 18;
  };
}
