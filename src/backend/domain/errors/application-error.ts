/**
 * Classe base para erros da aplicação que inclui código de status HTTP
 *
 * Esta classe estende a classe Error nativa do JavaScript e adiciona
 * suporte a códigos de status HTTP. Serve como classe base para todos
 * os erros personalizados da aplicação, facilitando o tratamento uniforme
 * de exceções e sua conversão em respostas HTTP apropriadas.
 *
 * @remarks
 * Classes de erro específicas devem estender esta classe base e definir
 * códigos de status HTTP adequados para cada tipo de erro de negócio.
 * Isso permite uma separação clara entre a lógica de domínio e os detalhes
 * de apresentação HTTP.
 *
 * @example
 *
 * // Criar um erro de aplicação básico
 * throw new ApplicationError("Operação não permitida", 403);
 *
 * // Criar uma classe de erro específica
 * class ResourceNotFoundError extends ApplicationError {
 *   constructor(resource: string) {
 *     super(`${resource} não encontrado(a)`, 404);
 *   }
 * }
 *
 * // Uso em um controlador ou serviço
 * if (!user) {
 *   throw new ResourceNotFoundError("Usuário");
 * }
 *
 *
 * @extends {Error}
 */
export class ApplicationError extends Error {
  /**
   * Cria uma nova instância de ApplicationError
   *
   * @param {string} message - Mensagem descritiva do erro
   * @param {number} [statusCode=400] - Código de status HTTP do erro (padrão: 400 Bad Request)
   */
  constructor(
    message: string,
    readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Preserva o stack trace correto em Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
