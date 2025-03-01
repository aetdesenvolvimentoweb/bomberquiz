import type { BcryptModule } from "../types";
import { HashOperationError } from "@/backend/domain/errors";
import { HashProvider } from "@/backend/domain/providers";

export class BcryptHashProvider implements HashProvider {
  private bcryptModule: BcryptModule | null = null;

  constructor(private readonly saltRounds: number = 12) {}

  private async getBcrypt(): Promise<BcryptModule> {
    if (!this.bcryptModule) {
      // import() dinâmico é permitido pelo ESLint
      const bcryptImport = await import("bcrypt");
      this.bcryptModule = bcryptImport.default;
    }
    return this.bcryptModule;
  }

  public async hash(value: string): Promise<string> {
    try {
      const bcrypt = await this.getBcrypt();
      return await bcrypt.hash(value, this.saltRounds);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error: unknown) {
      throw new HashOperationError("Erro ao gerar hash");
    }
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    try {
      const bcrypt = await this.getBcrypt();
      return await bcrypt.compare(value, hash);
    } catch (error: unknown) {
      // Aqui usamos o error, então não precisamos renomear
      throw new HashOperationError(
        `Erro ao comparar hash: ${(error as Error).message}`,
      );
    }
  }
}
