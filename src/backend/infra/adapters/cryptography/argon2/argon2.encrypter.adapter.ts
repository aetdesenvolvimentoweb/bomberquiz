import { EncrypterUseCase } from "@/backend/domain/use-cases";
import argon2 from "argon2";

/**
 * Implementa o caso de uso de criptografia usando Argon2
 */
export class Argon2EncrypterAdapter implements EncrypterUseCase {
  /**
   * Criptografa uma senha
   * @param password Senha a ser criptografada
   * @returns Senha criptografada
   */
  public readonly encrypt = async (password: string): Promise<string> => {
    return await argon2.hash(password);
  };

  /**
   * Verifica se uma senha corresponde ao hash
   * @param params Objeto contendo senha e hash para verificação
   * @returns True se a senha corresponder ao hash, false caso contrário
   */
  public readonly verify = async ({
    password,
    passwordHash,
  }: {
    password: string;
    passwordHash: string;
  }): Promise<boolean> => {
    return await argon2.verify(passwordHash, password);
  };
}
