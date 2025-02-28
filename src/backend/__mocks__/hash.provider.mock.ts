/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashProvider } from "../domain/providers/hash.provider";

export class HashProviderMock implements HashProvider {
  public readonly hash = async (value: string): Promise<string> => {
    return "value_hash";
  };

  public readonly compare = async (
    value: string,
    hash: string,
  ): Promise<boolean> => {
    return true;
  };
}
