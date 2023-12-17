import { adaptRouteNextjs } from "@/modules/backend/application/adapters";
import { makeAddMilitaryRankController } from "@/modules/backend/application/factories/controllers";
import { URL } from "url";

describe("AdaptRouteNextjs", () => {
  test("should be return 201 if correct data is provided", async () => {
    const addMilitaryRankController = makeAddMilitaryRankController();

    const httpRequest = { body: { order: 1, name: "any_military_rank" } };
    const sut = await adaptRouteNextjs(addMilitaryRankController, httpRequest);
    expect(sut.status).toBe(201);
  });
  test("should be return 400 if no order is provided", async () => {
    const addMilitaryRankController = makeAddMilitaryRankController();

    const httpRequest = { body: { order: 0, name: "any_military_rank" } };
    const sut = await adaptRouteNextjs(addMilitaryRankController, httpRequest);
    expect(sut.status).toBe(400);
    expect(await sut.json()).toHaveProperty("error");
  });
});
