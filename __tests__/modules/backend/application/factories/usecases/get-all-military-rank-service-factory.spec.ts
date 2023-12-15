import { makeGetAllMilitaryRankService } from "@/modules/backend/application/factories/usecases";

describe("GetAllMilitaryRankServiceFactory", () => {
  test("should be create an instance of GetAllMilitaryRankService", async () => {
    const sut = makeGetAllMilitaryRankService();

    expect(sut).toHaveProperty("getAll");
  });
});
