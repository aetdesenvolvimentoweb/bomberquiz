import { makeGetAllMilitaryRankController } from "@/modules/backend/application/factories/controllers";

describe("GetAllMilitaryRankControllerFactory", () => {
  test("should be create an instance of GetAllMilitaryRankController", async () => {
    const sut = makeGetAllMilitaryRankController();

    expect(sut).toHaveProperty("handle");
  });
});
