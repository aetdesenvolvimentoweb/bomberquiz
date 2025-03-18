import { XssSanitizerUseCase } from "@/backend/domain/sanitizers/security";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * Implementação concreta do sanitizador XSS usando DOMPurify
 *
 * Esta classe implementa a lógica de sanitização de texto para prevenir
 * ataques XSS (Cross-Site Scripting), removendo ou escapando elementos HTML
 * potencialmente perigosos.
 *
 * @implements {XssSanitizerUseCase}
 */
export class DOMPurifyXssSanitizer implements XssSanitizerUseCase {
  /**
   * Instância do DOMPurify configurada para ambiente Node.js
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly purifier: any;

  /**
   * Cria uma nova instância do DOMPurifyXssSanitizer
   */
  constructor() {
    // Configuração do DOMPurify para ambiente Node.js
    const { window } = new JSDOM("");
    this.purifier = DOMPurify(window);
  }

  /**
   * Sanitiza texto para prevenir ataques XSS
   *
   * Remove ou escapa elementos HTML potencialmente perigosos como
   * scripts, eventos inline, iframes e outros vetores de ataque.
   *
   * @param {string} text - Texto a ser sanitizado que pode conter conteúdo malicioso
   * @returns {string} Texto sanitizado seguro para renderização em navegadores
   */
  sanitize(text: string): string {
    if (!text) {
      return "";
    }

    // Configuração para sanitização rigorosa
    const config = {
      ALLOWED_TAGS: [] as string[],
      ALLOWED_ATTR: [] as string[],
      KEEP_CONTENT: true,
      SANITIZE_DOM: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false,
      FORCE_BODY: false,
      SANITIZE_NAMED_PROPS: true,
      USE_PROFILES: { html: true },
    };

    // Sanitiza o texto usando DOMPurify
    return this.purifier.sanitize(text, config);
  }
}
