/**
 * Módulo de exportação para sanitizadores de dados do domínio
 *
 * Este arquivo centraliza a exportação de todos os sanitizadores da aplicação,
 * seguindo o padrão de barril (barrel pattern). Isso permite importar qualquer
 * sanitizador a partir de um único ponto de entrada, simplificando as importações
 * em outros módulos.
 *
 * Os sanitizadores são responsáveis por normalizar e limpar dados de entrada
 * antes que eles sejam validados e processados pela lógica de negócio. Esta
 * camada ajuda a garantir consistência nos dados e melhora a experiência do
 * usuário ao lidar com diferentes formatos de entrada.
 *
 * @module domain/sanitizers
 *
 * @example
 *
 * // Importação simplificada de sanitizadores
 * import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
 *
 * // Uso em um serviço
 * class UserService {
 *   constructor(private sanitizer: UserCreateDataSanitizerUseCase) {}
 *
 *   async createUser(rawData) {
 *     // Sanitiza os dados antes de processá-los
 *     const sanitizedData = this.sanitizer.sanitize(rawData);
 *     // Continua o processamento...
 *   }
 * }
 *
 */

export * from "./user";
