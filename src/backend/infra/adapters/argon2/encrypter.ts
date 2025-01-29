import { EncrypterUseCase } from "@/backend/domain/use-cases";
import argon2 from "argon2";

export class Argon2EncrypterAdapter implements EncrypterUseCase {
  public readonly encrypt = async (password: string): Promise<string> => {
    return await argon2.hash(password);
  };

  public readonly verify = async (
    password: string,
    passwordHash: string
  ): Promise<boolean> => {
    return await argon2.verify(passwordHash, password);
  };
}
