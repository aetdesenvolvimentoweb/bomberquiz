import { makeGetByIdMilitaryRankController } from "@/modules/backend/application/factories/controllers/get-by-id-military-rank-controller-factory";

describe("GetByIdMilitaryRankControllerFactory", () => {
  test("should be create an instance of GetByIdMilitaryRankController", async () => {
    const sut = makeGetByIdMilitaryRankController();

    expect(sut).toHaveProperty("handle");
  });
});
