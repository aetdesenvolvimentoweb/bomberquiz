/* eslint-disable @typescript-eslint/no-unused-vars */
import { EncrypterUseCase } from "@/backend/domain/use-cases";

export class EncrypterStub implements EncrypterUseCase {
  async encrypt(password: string): Promise<string> {
    return "hashed_password";
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    return true;
  }
}
