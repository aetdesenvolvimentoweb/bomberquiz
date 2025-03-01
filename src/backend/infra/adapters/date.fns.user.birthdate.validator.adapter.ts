import { DateFnsModule } from "../types/date.fns.module";
import { InvalidParamError } from "@/backend/domain/errors";
import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators";

/**
 * Implementação do validador de data de nascimento usando date-fns
 *
 * Nota: Esta implementação usa lazy loading com importação dinâmica,
 * o que significa que o método validate é assíncrono, embora a interface
 * UserBirthdateValidatorUseCase defina validate como síncrono.
 */
export class DateFnsUserBirthdateValidatorAdapter
  implements UserBirthdateValidatorUseCase
{
  private dateFnsModule: DateFnsModule | null = null;
  private readonly minimumAge: number; // Idade mínima em anos

  /**
   * @param minimumAge Idade mínima em anos (padrão: 18)
   */
  constructor(minimumAge = 18) {
    this.minimumAge = minimumAge;
  }

  /**
   * Carrega o módulo date-fns dinamicamente
   * @returns Módulo date-fns com as funções necessárias
   */
  private async getDateFns(): Promise<DateFnsModule> {
    if (!this.dateFnsModule) {
      try {
        // Importação dinâmica assíncrona
        const dateFns = await import("date-fns");

        this.dateFnsModule = {
          isValid: dateFns.isValid,
          subYears: dateFns.subYears,
        };
      } catch (error) {
        throw new Error(
          `Erro ao carregar date-fns: ${(error as Error).message}`,
        );
      }
    }
    return this.dateFnsModule;
  }

  /**
   * Valida se a data de nascimento é válida e se o usuário tem a idade mínima
   * @param birthdate Data de nascimento a ser validada
   * @throws {InvalidParamError} Se a data de nascimento for inválida ou o usuário não tiver a idade mínima
   *
   * Nota: Este método é assíncrono devido ao lazy loading, embora a interface
   * UserBirthdateValidatorUseCase defina validate como síncrono.
   */
  public async validate(birthdate: Date): Promise<void> {
    const dateFns = await this.getDateFns();

    // Verifica se a data é válida
    if (!dateFns.isValid(birthdate)) {
      throw new InvalidParamError("data de nascimento");
    }

    // Verifica se o usuário tem a idade mínima
    const minimumBirthdate = dateFns.subYears(new Date(), this.minimumAge);

    if (birthdate > minimumBirthdate) {
      throw new InvalidParamError(
        "data de nascimento - idade mínima não atingida",
      );
    }
  }
}
