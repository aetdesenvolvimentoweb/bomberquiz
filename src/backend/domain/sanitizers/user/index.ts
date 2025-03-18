/**
 * Módulo de exportação para sanitizadores de dados de usuário
 *
 * Este arquivo centraliza a exportação de todas as interfaces e implementações
 * relacionadas à sanitização de dados de usuário, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer sanitizador de usuário a partir
 * de um único ponto de entrada.
 *
 * A sanitização é uma etapa importante no processamento de dados que ocorre
 * antes da validação, permitindo normalizar entradas em diferentes formatos
 * para um formato padrão consistente.
 *
 * @module domain/sanitizers/user
 *
 * @example
 *
 * // Importação simplificada
 * import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers/user";
 *
 * // Uso em um serviço ou controlador
 * class UserController {
 *   constructor(private sanitizer: UserCreateDataSanitizerUseCase) {}
 *
 *   async createUser(req, res) {
 *     // Sanitiza os dados antes de processá-los
 *     const sanitizedData = this.sanitizer.sanitize(req.body);
 *     // Continua o processamento...
 *   }
 * }
 *
 */

export * from "./user-create-data-sanitizer";
