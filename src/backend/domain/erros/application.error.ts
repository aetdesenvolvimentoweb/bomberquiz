/**
 * Classe base para erros da aplicação que inclui código de status HTTP
 * @param message Mensagem descritiva do erro
 * @param statusCode Código de status HTTP do erro
 */
export class ApplicationError extends Error {
  constructor(
    message: string,
    readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
