import {
  badRequest,
  conflict,
  created,
  errorHandler,
  serverError,
} from "../http";
import { ApplicationError } from "@/backend/domain/errors";

describe("HTTP Helpers", () => {
  describe("created", () => {
    it("should return 201 status code and success body", () => {
      const httpResponse = created();

      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });
  });

  describe("badRequest", () => {
    it("should return 400 status code and error message", () => {
      const errorMessage = "Invalid data";
      const httpResponse = badRequest(errorMessage);

      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(errorMessage);
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });

    it("should allow custom status code", () => {
      const errorMessage = "Invalid data";
      const statusCode = 422;
      const httpResponse = badRequest(errorMessage, statusCode);

      expect(httpResponse.statusCode).toBe(statusCode);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(errorMessage);
    });
  });

  describe("conflict", () => {
    it("should return 409 status code and error message", () => {
      const errorMessage = "Resource already exists";
      const httpResponse = conflict(errorMessage);

      expect(httpResponse.statusCode).toBe(409);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(errorMessage);
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });
  });

  describe("serverError", () => {
    it("should return 500 status code and default error message", () => {
      const httpResponse = serverError();

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe("Erro interno do servidor");
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });

    it("should allow custom error message", () => {
      const errorMessage = "Custom server error";
      const httpResponse = serverError(errorMessage);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(errorMessage);
    });
  });

  describe("errorHandler", () => {
    it("should handle ApplicationError with correct status code", () => {
      const errorMessage = "Validation error";
      const statusCode = 422;
      const error = new ApplicationError(errorMessage, statusCode);

      const httpResponse = errorHandler(error);

      expect(httpResponse.statusCode).toBe(statusCode);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(errorMessage);
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });

    it("should return serverError for unknown errors", () => {
      const error = new Error("Unknown error");
      const httpResponse = errorHandler(error);

      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe("Erro interno do servidor");
      expect(httpResponse.body.metadata).toBeDefined();
      expect(httpResponse.body.metadata.timestamp).toBeDefined();
    });
  });
});
