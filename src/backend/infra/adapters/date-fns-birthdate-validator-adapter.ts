import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators";
import { InvalidParamError } from "@/backend/domain/errors";
import { differenceInYears, isValid, isPast } from "date-fns";

/**
 * Implementação concreta do validador de data de nascimento usando date-fns
 *
 * Esta classe implementa a lógica de validação de datas de nascimento,
 * verificando se a idade está dentro dos limites permitidos (18-65 anos)
 * e se a data não está no futuro.
 *
 * @implements {UserBirthdateValidatorUseCase}
 */
export class DateFnsBirthdateValidator
  implements UserBirthdateValidatorUseCase
{
  /**
   * Idade mínima permitida em anos
   */
  private readonly MIN_AGE_YEARS: number;

  /**
   * Idade máxima permitida em anos
   */
  private readonly MAX_AGE_YEARS: number;

  /**
   * Cria uma nova instância do validador de data de nascimento
   *
   * @param {object} options - Opções de configuração para o validador
   * @param {number} options.minAgeYears - Idade mínima permitida em anos (padrão: 18)
   * @param {number} options.maxAgeYears - Idade máxima permitida em anos (padrão: 65)
   */
  constructor(options?: { minAgeYears?: number; maxAgeYears?: number }) {
    this.MIN_AGE_YEARS = options?.minAgeYears ?? 18;
    this.MAX_AGE_YEARS = options?.maxAgeYears ?? 65;
  }

  /**
   * Valida uma data de nascimento
   *
   * @param {Date} birthdate - Data de nascimento a ser validada
   * @returns {void} Não retorna valor, mas lança exceção se a data for inválida
   * @throws {InvalidParamError} Quando a data de nascimento não atende aos critérios de validação
   */
  validate(birthdate: Date): void {
    // Verifica se a data é válida
    if (!birthdate || !isValid(birthdate)) {
      throw new InvalidParamError("data de nascimento", "data inválida");
    }

    const today = new Date();

    // Verifica se a data está no futuro
    if (!isPast(birthdate)) {
      throw new InvalidParamError(
        "data de nascimento",
        "não pode ser no futuro",
      );
    }

    // Calcula a idade usando date-fns
    const age = differenceInYears(today, birthdate);

    // Verifica idade mínima
    if (age < this.MIN_AGE_YEARS) {
      throw new InvalidParamError(
        "data de nascimento",
        `usuário deve ter pelo menos ${this.MIN_AGE_YEARS} anos`,
      );
    }

    // Verifica idade máxima
    if (age > this.MAX_AGE_YEARS) {
      throw new InvalidParamError(
        "data de nascimento",
        `idade excede o limite máximo de ${this.MAX_AGE_YEARS} anos`,
      );
    }
  }
}
