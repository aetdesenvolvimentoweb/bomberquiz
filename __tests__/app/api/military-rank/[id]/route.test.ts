import { GET } from "@/app/api/military-ranks/[id]/route";

describe("AdaptRouteNextjs", () => {
  test("should be return 400 if GET method call with no registered id", async () => {
    const request = new Request(
      new URL("http://localhost:3000/api/military-rank"),
      {
        method: "GET",
      }
    );

    const sut = await GET(request, { params: { id: "no_registered_id" } });

    expect(sut.status).toBe(400);
  });
});
