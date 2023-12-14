import { POST } from "@/app/api/military-ranks/route";
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

    const sut = await POST(request);

    expect(sut.status).toBe(201);
  });
});
