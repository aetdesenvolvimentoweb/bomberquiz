import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import {
  DuplicatedKeyError,
  MissingParamError,
} from "@/modules/backend/presentation/errors";

interface SutResponse {
  sut: AddMilitaryRankService;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const sut = new AddMilitaryRankService(militaryRankRepository);

  return { sut };
};

describe("AddMilitaryRankService", () => {
  test("should throws if no order is provided", async () => {
    const { sut } = makeSut();

    await expect(
      sut.add({ order: 0, name: "any_military_rank" })
    ).rejects.toThrow(new MissingParamError("ordem"));
  });
  test("should throws if no name is provided", async () => {
    const { sut } = makeSut();

    await expect(sut.add({ order: 1, name: "" })).rejects.toThrow(
      new MissingParamError("nome")
    );
  });
  test("should throws if already registered name is provided", async () => {
    const { sut } = makeSut();

    await sut.add({ order: 1, name: "any_military_rank" });

    await expect(
      sut.add({ order: 2, name: "any_military_rank" })
    ).rejects.toThrow(new DuplicatedKeyError("nome"));
  });
  test("should be add a military rank in db", async () => {
    const { sut } = makeSut();

    await expect(
      sut.add({ order: 1, name: "any_military_rank" })
    ).resolves.not.toThrow();
  });
});
