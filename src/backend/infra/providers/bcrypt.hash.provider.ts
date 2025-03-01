/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from "bcrypt";
import { HashOperationError } from "@/backend/domain/errors";
import { HashProvider } from "@/backend/domain/providers";

export class BcryptHashProvider implements HashProvider {
  constructor(private readonly saltRounds: number = 12) {}

  public async hash(value: string): Promise<string> {
    try {
      return await bcrypt.hash(value, this.saltRounds);
    } catch (error: unknown) {
      throw new HashOperationError("Erro ao gerar hash");
    }
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, hash);
    } catch (error: unknown) {
      throw new HashOperationError(
        `Erro ao comparar hash: ${(error as Error).message}`,
      );
    }
  }
}
