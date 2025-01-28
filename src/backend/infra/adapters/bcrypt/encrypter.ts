import { EncrypterUseCase } from "@/backend/domain/use-cases";
import bcrypt from "bcrypt";

export class BcryptEncrypterAdapter implements EncrypterUseCase {
  public readonly encrypt = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };

  public readonly verify = async (
    password: string,
    passwordHash: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, passwordHash);
  };
}
