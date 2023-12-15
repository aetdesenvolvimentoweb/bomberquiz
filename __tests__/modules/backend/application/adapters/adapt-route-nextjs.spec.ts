import { adaptRouteNextjs } from "@/modules/backend/application/adapters";
import { makeAddMilitaryRankController } from "@/modules/backend/application/factories/controllers";
import { URL } from "url";

describe("AdaptRouteNextjs", () => {
  test("should be return 201 if correct data is provided", async () => {
    const request = new Request(
      new URL("http://localhost:3000/military-rank"),
      {
        body: JSON.stringify({ order: 1, name: "any_military_rank" }),
        method: "POST",
      }
    );
    const addMilitaryRankController = makeAddMilitaryRankController();

    const sut = await adaptRouteNextjs(addMilitaryRankController, request);
    expect(sut.status).toBe(201);
  });
  test("should be return 400 if no order is provided", async () => {
    const request = new Request(
      new URL("http://localhost:3000/military-rank"),
      {
        body: JSON.stringify({ order: 0, name: "any_military_rank" }),
        method: "POST",
      }
    );
    const addMilitaryRankController = makeAddMilitaryRankController();

    const sut = await adaptRouteNextjs(addMilitaryRankController, request);
    expect(sut.status).toBe(400);
    expect(await sut.json()).toHaveProperty("error");
  });
});
