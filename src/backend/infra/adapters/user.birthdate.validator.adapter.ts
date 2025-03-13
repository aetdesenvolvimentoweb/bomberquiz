import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators";

export class UserBirthdateValidatorAdapter
  implements UserBirthdateValidatorUseCase
{
  private isDateFunction: ((birthdate: Date) => boolean) | null = null;

  // Método protegido para permitir mock em testes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async importDateFns(): Promise<any> {
    return import("date-fns");
  }

  private readonly getDateValidator = async (): Promise<
    ((birthdate: Date) => boolean) | null
  > => {
    try {
      const dateFns = await this.importDateFns();
      // Garantir que isDateFunction nunca é null ao retornar
      this.isDateFunction = dateFns.isDate;
      return this.isDateFunction;
    } catch (error: unknown) {
      throw new ServerError(error as Error);
    }
  };

  public readonly validate = async (birthdate: Date): Promise<void> => {
    try {
      const isDate = await this.getDateValidator();

      if (!isDate) {
        throw new ServerError(new Error("date-fns não importado"));
      }

      if (!isDate(birthdate)) {
        throw new InvalidParamError("data de nascimento");
      }

      const yearBirthdate = birthdate.getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - yearBirthdate;

      if (age < 18) {
        throw new InvalidParamError("data de nascimento");
      }

      if (age === 18) {
        const currentMonth = new Date().getMonth();
        const birthdateMonth = birthdate.getMonth();

        if (birthdateMonth > currentMonth) {
          throw new InvalidParamError("data de nascimento");
        }

        if (birthdateMonth === currentMonth) {
          const currentDay = new Date().getDate();
          const birthdateDay = birthdate.getDate();

          if (birthdateDay > currentDay) {
            throw new InvalidParamError("data de nascimento");
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };
}
