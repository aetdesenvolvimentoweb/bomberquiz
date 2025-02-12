/**
 * Define o contrato para erro base da aplicação
 */
export interface ErrorAppUseCase {
  message: string;
  statusCode: number;
  name: string;
}
