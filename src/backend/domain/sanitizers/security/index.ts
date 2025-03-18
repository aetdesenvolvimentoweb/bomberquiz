/**
 * Módulo de exportação para sanitizadores de segurança
 *
 * Este arquivo centraliza a exportação de todas as interfaces e implementações
 * relacionadas à sanitização de segurança, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer sanitizador de segurança
 * a partir de um único ponto de entrada.
 *
 * Os sanitizadores de segurança são componentes essenciais para proteger a
 * aplicação contra vulnerabilidades comuns como XSS (Cross-Site Scripting),
 * injeção de código e outros vetores de ataque baseados em entrada de usuário.
 *
 * @module domain/sanitizers/security
 *
 * @example
 *
 * // Importação simplificada
 * import { XssSanitizerUseCase } from "@/backend/domain/sanitizers/security";
 *
 * // Uso em um serviço
 * class ContentService {
 *   constructor(private xssSanitizer: XssSanitizerUseCase) {}
 *
 *   processUserContent(rawContent: string): string {
 *     // Sanitiza o conteúdo para remover potenciais ataques XSS
 *     return this.xssSanitizer.sanitize(rawContent);
 *   }
 * }
 *
 */

export * from "./xss-sanitizer";
