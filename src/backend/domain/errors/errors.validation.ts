import { ErrorApp } from "@/backend/data/shared";

/**
 * Define o contrato para erros de validação no sistema
 */
export interface ErrorsValidationUseCase {
  duplicatedKeyError: (props: { entity: string; key: string }) => ErrorApp;
  invalidParamError: (param: string) => ErrorApp;
  missingParamError: (param: string) => ErrorApp;
  unauthorizedError: () => ErrorApp;
  unregisteredError: (param: string) => ErrorApp;
  wrongPasswordError: (param: string) => ErrorApp;
}
