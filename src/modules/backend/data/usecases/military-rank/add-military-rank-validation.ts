import { AddMilitaryRankModel } from "@/modules/backend/domain/models";
import {
  DuplicatedKeyValidation,
  MissingParamValidation,
} from "@/modules/backend/domain/validations";
import { MilitaryRankRepository } from "@/modules/backend/data/protocols/repositories";
import {
  DuplicatedKeyError,
  MissingParamError,
} from "@/modules/backend/presentation/errors";

export class AddMilitaryRankValidation
  implements MissingParamValidation, DuplicatedKeyValidation
{
  constructor(
    private readonly militaryRankRepository: MilitaryRankRepository
  ) {}

  checkMissingParams = async (data: AddMilitaryRankModel): Promise<void> => {
    const requiredParams: Array<{
      field: keyof AddMilitaryRankModel;
      label: string;
    }> = [
      { field: "name", label: "nome" },
      { field: "order", label: "ordem" },
    ];

    for (const param of requiredParams) {
      if (!data[param.field]) {
        throw new MissingParamError(param.label);
      }
    }
  };

  checkDuplicatedKey = async (name: string): Promise<void> => {
    const militaryRankAlreadyRegistered =
      await this.militaryRankRepository.getByName(name);

    if (!militaryRankAlreadyRegistered) {
      throw new DuplicatedKeyError("nome");
    }
  };
}
