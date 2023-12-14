import { makeAddMilitaryRankController } from "@/modules/backend/application/factories/controllers";

describe("AddMilitaryRankControllerFactory", () => {
  test("should be create an instance of AddMilitaryRankController", async () => {
    const sut = makeAddMilitaryRankController();

    expect(sut).toHaveProperty("handle");
  });
});
