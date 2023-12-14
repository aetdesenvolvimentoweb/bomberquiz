import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRanksInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { AddMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";
import { MissingParamError } from "@/modules/backend/presentation/errors";

interface SutResponse {
  sut: AddMilitaryRankController;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRanksInMemoryRepository();
  const addMilitaryRankService = new AddMilitaryRankService(
    militaryRankRepository
  );
  const sut = new AddMilitaryRankController(addMilitaryRankService);
  return { sut };
};

describe("AddMilitaryRankController", () => {
  test("should be return 400 if no order is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      order: 0,
      name: "any_military_rank",
    });

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.error).toEqual(new MissingParamError("ordem").message);
  });
  test("should be return 400 if no name is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      order: 1,
      name: "",
    });

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.error).toEqual(new MissingParamError("nome").message);
  });
  test("should be return 201 if correct data is provided", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({
      order: 1,
      name: "any_military_rank",
    });

    expect(httpResponse.statusCode).toBe(201);
  });
});
