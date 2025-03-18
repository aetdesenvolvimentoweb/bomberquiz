import argon2 from "argon2";
import {
  HashProvider,
  HashOptions,
} from "@/backend/domain/providers/hash-provider";
import { ServerError, InvalidParamError } from "@/backend/domain/errors";

/**
 * Implementação do HashProvider utilizando o algoritmo Argon2id
 *
 * Esta classe fornece uma implementação segura do contrato HashProvider
 * utilizando o algoritmo Argon2id, vencedor da competição de hashing de senhas
 * e recomendado para aplicações que necessitam de alta segurança.
 *
 * @implements {HashProvider}
 */
export class Argon2Hash implements HashProvider {
  /**
   * Configurações padrão para o algoritmo Argon2id
   */
  private readonly defaultOptions: Required<Omit<HashOptions, "algorithm">> = {
    iterations: 3,
    memoryCost: 65536, // 64 MiB
    parallelism: 4,
    hashLength: 32,
  };

  /**
   * Configurações personalizadas para esta instância
   */
  private options: HashOptions;

  /**
   * Cria uma nova instância do Argon2Hash
   *
   * @param {HashOptions} [options={}] - Opções personalizadas para o algoritmo
   */
  constructor(options: HashOptions = {}) {
    this.options = { ...options };
  }

  /**
   * Gera um hash a partir de uma string fornecida usando Argon2id
   *
   * @param {string} plaintext - Texto em formato plano para ser transformado em hash
   * @param {HashOptions} [options] - Opções adicionais para esta operação específica
   * @returns {Promise<string>} Hash gerado
   * @throws {InvalidParamError} Se o texto fornecido for inválido
   * @throws {ServerError} Se ocorrer um erro durante o processo de hash
   */
  async hash(plaintext: string, options?: HashOptions): Promise<string> {
    // Validação do texto fornecido
    if (!plaintext) {
      throw new InvalidParamError("texto", "não pode ser vazio");
    }

    try {
      // Combina as opções padrão com as opções da instância e as opções específicas desta chamada
      const mergedOptions = {
        ...this.defaultOptions,
        ...this.options,
        ...options,
      };

      // Configura as opções para o Argon2
      const argonOptions = {
        type: argon2.argon2id, // Usa o algoritmo Argon2id
        memoryCost: mergedOptions.memoryCost,
        timeCost: mergedOptions.iterations,
        parallelism: mergedOptions.parallelism,
        hashLength: mergedOptions.hashLength,
      };

      // Gera o hash - o salt é gerado automaticamente pela biblioteca
      return await argon2.hash(plaintext, argonOptions);
    } catch (error) {
      // Captura erros específicos do argon2 e converte para erros da aplicação
      if (error instanceof Error) {
        throw new ServerError(error);
      }
      throw new ServerError(
        new Error("Erro desconhecido durante o processo de hash"),
      );
    }
  }

  /**
   * Verifica se um texto em formato plano corresponde a um hash previamente gerado
   *
   * @param {string} plaintext - Texto em formato plano para comparação
   * @param {string} hashedText - Hash previamente gerado para comparação
   * @returns {Promise<boolean>} Verdadeiro se o plaintext corresponde ao hash
   * @throws {InvalidParamError} Se os parâmetros fornecidos forem inválidos
   * @throws {ServerError} Se ocorrer um erro durante a verificação
   */
  async compare(plaintext: string, hashedText: string): Promise<boolean> {
    // Validação dos parâmetros
    if (!plaintext) {
      throw new InvalidParamError("texto", "não pode ser vazio");
    }

    if (!hashedText) {
      throw new InvalidParamError("hash", "não pode ser vazio");
    }

    try {
      return await argon2.verify(hashedText, plaintext);
    } catch (error) {
      // Erros de verificação podem ser de formato inválido ou problemas internos
      if (error instanceof Error && error.message.includes("invalid")) {
        throw new InvalidParamError("hash", "formato inválido");
      }

      if (error instanceof Error) {
        throw new ServerError(error);
      }

      throw new ServerError(
        new Error("Erro desconhecido durante a verificação do hash"),
      );
    }
  }

  /**
   * Cria uma nova instância do hash provider com configurações personalizadas
   *
   * @param {HashOptions} options - Configurações a serem aplicadas em todas as operações
   * @returns {HashProvider} Nova instância do hash provider com as configurações incorporadas
   */
  withOptions(options: HashOptions): HashProvider {
    return new Argon2Hash({
      ...this.options,
      ...options,
    });
  }
}
