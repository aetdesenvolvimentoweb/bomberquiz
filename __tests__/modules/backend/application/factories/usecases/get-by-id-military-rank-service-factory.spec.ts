import { makeGetByIdMilitaryRankService } from "@/modules/backend/application/factories/usecases/get-by-id-military-rank-service-factory";

describe("GetByIdMilitaryRankServiceFactory", () => {
  test("should be create an instance of GetByIdMilitaryRankService", async () => {
    const sut = makeGetByIdMilitaryRankService();

    expect(sut).toHaveProperty("getById");
  });
});
