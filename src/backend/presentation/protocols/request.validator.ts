/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Interface para validadores na camada de presentation
 * @template T Tipo de dados a ser validado
 */
export interface RequestValidator<T = any> {
  validate(input: T): void;
}
