/**
 * Definições de contratos para o serviço de hash da aplicação
 *
 * Este módulo define a interface e tipos relacionados ao serviço de hash,
 * permitindo a implementação de diferentes estratégias de encriptação sem
 * alterar o código do domínio.
 */

/**
 * Opções de configuração para a geração de hash
 *
 * @interface
 */
export interface HashOptions {
  /** Tipo de algoritmo a ser utilizado (ex: 'argon2id', 'bcrypt') */
  algorithm?: string;
  /** Número de rounds/iterações para o algoritmo de hash */
  iterations?: number;
  /** Fator de memória em KiB (específico para Argon2) */
  memoryCost?: number;
  /** Fator de paralelismo (específico para Argon2) */
  parallelism?: number;
  /** Comprimento do hash resultante em bytes */
  hashLength?: number;
}

/**
 * Contrato para implementações de serviços de hash
 *
 * Define os métodos que qualquer implementação de hash provider deve fornecer.
 * Suporta diferentes algoritmos e configurações de hash.
 *
 * @interface
 */
export interface HashProvider {
  /**
   * Gera um hash a partir de uma string fornecida
   *
   * @param {string} plaintext - Texto em formato plano para ser transformado em hash
   * @param {HashOptions} [options] - Opções de configuração do algoritmo
   * @returns {Promise<string>} Hash gerado
   */
  hash(plaintext: string, options?: HashOptions): Promise<string>;

  /**
   * Verifica se um texto em formato plano corresponde a um hash previamente gerado
   *
   * @param {string} plaintext - Texto em formato plano para comparação
   * @param {string} hashedText - Hash previamente gerado para comparação
   * @returns {Promise<boolean>} Verdadeiro se o plaintext corresponde ao hash
   */
  compare(plaintext: string, hashedText: string): Promise<boolean>;

  /**
   * Cria uma nova instância do hash provider com configurações personalizadas
   *
   * Este método permite criar um hash provider que inclui automaticamente
   * determinadas configurações em todas as chamadas subsequentes, útil para
   * padronizar as configurações de hash em diferentes partes da aplicação.
   *
   * @param {HashOptions} options - Configurações a serem aplicadas em todas as operações
   * @returns {HashProvider} Nova instância do hash provider com as configurações incorporadas
   *
   * @example
   * // Criar um hash provider com configurações específicas
   * const secureHasher = hashProvider.withOptions({
   *   iterations: 4,
   *   memoryCost: 131072 // 128 MiB
   * });
   *
   * // Todos os hashes usarão automaticamente estas configurações
   * const hash = await secureHasher.hash('senha123');
   */
  withOptions(options: HashOptions): HashProvider;
}
