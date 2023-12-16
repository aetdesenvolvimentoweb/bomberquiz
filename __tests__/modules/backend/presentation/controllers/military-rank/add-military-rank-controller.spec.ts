import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { MilitaryRankInMemoryRepository } from "@/modules/backend/infra/db/in-memory";
import { AddMilitaryRankController } from "@/modules/backend/presentation/controllers/military-ranks";
import {
  DuplicatedKeyError,
  MissingParamError,
} from "@/modules/backend/data/errors";

interface SutResponse {
  addMilitaryRankService: AddMilitaryRankService;
  sut: AddMilitaryRankController;
}

const makeSut = (): SutResponse => {
  const militaryRankRepository = new MilitaryRankInMemoryRepository();
  const addMilitaryRankService = new AddMilitaryRankService(
    militaryRankRepository
  );
  const sut = new AddMilitaryRankController(addMilitaryRankService);
  return { addMilitaryRankService, sut };
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
  test("should be return 400 if duplicated name is provided", async () => {
    const { sut } = makeSut();

    await sut.handle({
      order: 1,
      name: "any_military_rank",
    });

    const httpResponse = await sut.handle({
      order: 2,
      name: "any_military_rank",
    });

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.error).toEqual(new DuplicatedKeyError("nome").message);
  });
  test("should be return 500 if server throws", async () => {
    const { addMilitaryRankService, sut } = makeSut();
    jest
      .spyOn(addMilitaryRankService, "add")
      .mockRejectedValue(new Error("Erro no servidor."));

    const httpResponse = await sut.handle({
      order: 1,
      name: "any_military_rank",
    });

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.error).toEqual(new Error("Erro no servidor.").message);
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
