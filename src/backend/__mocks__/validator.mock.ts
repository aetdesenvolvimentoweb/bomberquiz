/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationResult, Validator } from "@/backend/presentation/protocols";

/**
 * Mock para o Validator
 * @template T Tipo de dados a ser validado
 */
export class ValidatorMock<T = any> implements Validator<T> {
  private _result: ValidationResult = { isValid: true };

  /**
   * Define o resultado da validação
   * @param result Resultado da validação
   */
  setResult(result: ValidationResult): void {
    this._result = result;
  }

  /**
   * Valida os dados de entrada
   * @param input Dados a serem validados
   * @returns Resultado da validação
   */
  validate(_input: T): ValidationResult {
    return this._result;
  }
}
