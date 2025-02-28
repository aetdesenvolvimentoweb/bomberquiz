/* eslint-disable @typescript-eslint/no-unused-vars */
import { HashUseCase } from "../domain/usecases/hash";

export class HashProviderMock implements HashUseCase {
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
