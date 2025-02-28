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
      const response = created();

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });
  });

  describe("badRequest", () => {
    it("should return 400 status code and error message", () => {
      const errorMessage = "Invalid data";
      const response = badRequest(errorMessage);

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(errorMessage);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });

    it("should allow custom status code", () => {
      const errorMessage = "Invalid data";
      const statusCode = 422;
      const response = badRequest(errorMessage, statusCode);

      expect(response.statusCode).toBe(statusCode);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(errorMessage);
    });
  });

  describe("conflict", () => {
    it("should return 409 status code and error message", () => {
      const errorMessage = "Resource already exists";
      const response = conflict(errorMessage);

      expect(response.statusCode).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(errorMessage);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });
  });

  describe("serverError", () => {
    it("should return 500 status code and default error message", () => {
      const response = serverError();

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Erro interno do servidor");
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });

    it("should allow custom error message", () => {
      const errorMessage = "Custom server error";
      const response = serverError(errorMessage);

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(errorMessage);
    });
  });

  describe("errorHandler", () => {
    it("should handle ApplicationError with correct status code", () => {
      const errorMessage = "Validation error";
      const statusCode = 422;
      const error = new ApplicationError(errorMessage, statusCode);

      const response = errorHandler(error);

      expect(response.statusCode).toBe(statusCode);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe(errorMessage);
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });

    it("should return serverError for unknown errors", () => {
      const error = new Error("Unknown error");
      const response = errorHandler(error);

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.errorMessage).toBe("Erro interno do servidor");
      expect(response.body.metadata).toBeDefined();
      expect(response.body.metadata.timestamp).toBeDefined();
    });
  });
});
