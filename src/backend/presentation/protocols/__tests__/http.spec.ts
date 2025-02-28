import { HttpRequest, HttpResponse } from "../http";

describe("HTTP Protocols", () => {
  describe("HttpRequest", () => {
    it("should define the correct structure", () => {
      const request: HttpRequest = {
        body: { test: true },
        headers: { "Content-Type": "application/json" },
        params: { id: "123" },
        query: { filter: "active" },
      };

      expect(request).toHaveProperty("body");
      expect(request).toHaveProperty("headers");
      expect(request).toHaveProperty("params");
      expect(request).toHaveProperty("query");
    });

    it("should allow optional properties", () => {
      // Apenas com body
      const request1: HttpRequest = { body: { test: true } };
      expect(request1).toHaveProperty("body");

      // Apenas com headers
      const request2: HttpRequest = {
        headers: { "Content-Type": "application/json" },
      };
      expect(request2).toHaveProperty("headers");

      // Vazio
      const request3: HttpRequest = {};
      expect(request3).toBeDefined();
    });

    it("should allow generic type for body", () => {
      interface TestType {
        name: string;
        age: number;
      }

      const request: HttpRequest<TestType> = {
        body: { name: "Test", age: 30 },
      };

      expect(request.body?.name).toBe("Test");
      expect(request.body?.age).toBe(30);
    });
  });

  describe("HttpResponse", () => {
    it("should define the correct structure", () => {
      const response: HttpResponse = {
        statusCode: 200,
        body: {
          success: true,
          data: { test: true },
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
      };

      expect(response).toHaveProperty("statusCode");
      expect(response).toHaveProperty("body");
      expect(response.body).toHaveProperty("success");
      expect(response.body).toHaveProperty("metadata");
      expect(response.body.metadata).toHaveProperty("timestamp");
    });

    it("should allow optional properties", () => {
      const response: HttpResponse = {
        statusCode: 400,
        body: {
          success: false,
          errorMessage: "Invalid data",
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
      };

      expect(response.body).toHaveProperty("errorMessage");
      expect(response.body.errorMessage).toBe("Invalid data");
    });

    it("should allow generic type for data", () => {
      interface TestType {
        name: string;
        age: number;
      }

      const response: HttpResponse<TestType> = {
        statusCode: 200,
        body: {
          success: true,
          data: { name: "Test", age: 30 },
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
      };

      expect(response.body.data?.name).toBe("Test");
      expect(response.body.data?.age).toBe(30);
    });
  });
});
