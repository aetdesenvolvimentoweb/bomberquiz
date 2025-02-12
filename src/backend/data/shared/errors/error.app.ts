import { ErrorAppUseCase } from "@/backend/domain/errors/error.app";

/**
 * Define o erro padrão da aplicação
 */
export class ErrorApp extends Error implements ErrorAppUseCase {
  /**
   * Cria uma nova instância de erro da aplicação
   * @param message Mensagem descritiva do erro
   * @param statusCode Código HTTP do erro
   */
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = "ErrorApp";
  }
}
