import { makeAddMilitaryRankService } from "@/modules/backend/application/factories/usecases";

describe("AddMilitaryRankServiceFactory", () => {
  test("should be create an instance of AddMilitaryRankService", async () => {
    const sut = makeAddMilitaryRankService();

    expect(sut).toHaveProperty("add");
  });
});
