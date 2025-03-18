/**
 * Módulo de exportação para implementações de sanitizadores
 *
 * Este arquivo centraliza a exportação de todas as implementações concretas
 * dos sanitizadores definidos na camada de domínio, seguindo o padrão de barril
 * (barrel pattern). Isso permite importar qualquer sanitizador a partir
 * de um único ponto de entrada.
 *
 * Os sanitizadores são componentes responsáveis por limpar e normalizar dados
 * de entrada, removendo conteúdo potencialmente perigoso ou mal-formatado antes
 * que seja processado pelo sistema. Isso inclui sanitização contra ataques XSS
 * e normalização de dados de usuário.
 *
 * @module infra/sanitizers
 *
 * @example
 *
 * // Importação simplificada de sanitizadores
 * import { DOMPurifyXssSanitizer } from "@/backend/infra/sanitizers";
 *
 * // Uso em um serviço ou factory
 * const xssSanitizer = new DOMPurifyXssSanitizer();
 * const sanitizedContent = xssSanitizer.sanitize("<script>alert('XSS')</script>Hello");
 * // Resultado: "Hello"
 *
 */

export * from "./dom-purify-xss-sanitizer";
