export interface XssSanitizerUseCase {
  /**
   * Sanitiza texto para prevenir ataques XSS
   * @param text Texto a ser sanitizado
   * @returns Texto sanitizado
   */
  sanitize: (text: string) => string;
}
