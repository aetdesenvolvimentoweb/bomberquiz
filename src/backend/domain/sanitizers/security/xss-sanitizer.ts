/**
 * Interface para sanitização contra ataques XSS (Cross-Site Scripting)
 *
 * Define o contrato para implementações que sanitizam textos eliminando
 * potenciais vetores de ataque XSS, como scripts maliciosos, atributos
 * perigosos e outros conteúdos que poderiam ser executados no navegador.
 *
 * @remarks
 * A sanitização XSS é uma medida de segurança crítica para aplicações web
 * que exibem conteúdo gerado por usuários. Implementações desta interface
 * devem remover ou escapar elementos HTML potencialmente perigosos como:
 * - Tags de script e eventos inline (onclick, onload, etc.)
 * - Atributos javascript: em URLs
 * - Tags iframe, object, embed e outras que podem carregar conteúdo externo
 * - Atributos de estilo que podem conter expressões JavaScript
 *
 * @example
 *
 * // Exemplo de uso em um serviço
 * class CommentService {
 *   constructor(private xssSanitizer: XssSanitizerUseCase) {}
 *
 *   createComment(userId: string, rawComment: string) {
 *     // Sanitiza o comentário antes de armazenar
 *     const safeComment = this.xssSanitizer.sanitize(rawComment);
 *     return this.commentRepository.create({ userId, content: safeComment });
 *   }
 * }
 *
 *
 * @example
 *
 * // Exemplo de implementação usando uma biblioteca
 * import DOMPurify from 'dompurify';
 *
 * class DOMPurifyXssSanitizer implements XssSanitizerUseCase {
 *   sanitize(text: string): string {
 *     return DOMPurify.sanitize(text, {
 *       ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
 *       ALLOWED_ATTR: []
 *     });
 *   }
 * }
 *
 *
 * @interface
 */
export interface XssSanitizerUseCase {
  /**
   * Sanitiza texto para prevenir ataques XSS
   *
   * Remove ou escapa elementos HTML potencialmente perigosos como
   * scripts, eventos inline, iframes e outros vetores de ataque.
   *
   * @param {string} text - Texto a ser sanitizado que pode conter conteúdo malicioso
   * @returns {string} Texto sanitizado seguro para renderização em navegadores
   *
   * @throws {Error} Pode lançar erro se o texto não puder ser processado corretamente
   */
  sanitize: (text: string) => string;
}
