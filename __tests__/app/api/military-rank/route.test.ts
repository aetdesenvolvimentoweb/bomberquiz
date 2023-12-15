import { GET, POST } from "@/app/api/military-ranks/route";
import { URL } from "url";

describe("AdaptRouteNextjs", () => {
  test("should be return 201 if POST method call with correct data", async () => {
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
  test("should be return 200 if GET method call with correct data", async () => {
    const request = new Request(
      new URL("http://localhost:3000/military-rank"),
      {
        method: "GET",
      }
    );

    const sut = await GET(request);

    expect(sut.status).toBe(200);
  });
});
