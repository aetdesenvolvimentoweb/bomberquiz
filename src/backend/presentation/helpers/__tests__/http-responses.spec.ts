/**
 * Testes unitários para as funções de respostas HTTP
 *
 * Este arquivo testa as funções utilitárias que geram respostas HTTP padronizadas,
 * verificando se cada função retorna a estrutura de dados correta e o status
 * code apropriado.
 */

import { ApplicationError } from "@/backend/domain/errors";
import { created, serverError, handleError } from "../http-responses";

// Mock para Date.toISOString para tornar os testes determinísticos
const mockDate = new Date("2023-01-01T00:00:00.000Z");
const originalDateNow = Date.now;
const originalToISOString = Date.prototype.toISOString;

describe("HTTP Responses", () => {
  beforeAll(() => {
    // Mock global de Date
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }

      toISOString() {
        return "2023-01-01T00:00:00.000Z";
      }
    } as DateConstructor;
  });

  afterAll(() => {
    // Restaurar implementações originais
    global.Date.now = originalDateNow;
    Date.prototype.toISOString = originalToISOString;
  });

  describe("created", () => {
    it("deve retornar uma resposta com status 201 e success true", () => {
      // Act
      const httpResponse = created();

      // Assert
      expect(httpResponse).toEqual({
        body: {
          success: true,
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
        statusCode: 201,
      });
    });
  });

  describe("serverError", () => {
    it("deve retornar uma resposta com status 500 e a mensagem de erro", () => {
      // Arrange
      const error = new Error("Erro interno do servidor");

      // Act
      const httpResponse = serverError(error);

      // Assert
      expect(httpResponse).toEqual({
        body: {
          success: false,
          errorMessage: "Erro interno do servidor",
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
        statusCode: 500,
      });
    });

    it("deve retornar undefined como errorMessage quando o erro não é uma instância de Error", () => {
      // Arrange
      const errorString = "String de erro simples";

      // Act
      const httpResponse = serverError(errorString);

      // Assert
      expect(httpResponse.body.errorMessage).toBeUndefined();
      expect(httpResponse.statusCode).toBe(500);
    });
  });

  describe("handleError", () => {
    it("deve retornar uma resposta com o status e mensagem do ApplicationError", () => {
      // Arrange
      class CustomApplicationError extends ApplicationError {
        constructor() {
          super("Erro de aplicação customizado", 422);
        }
      }

      const applicationError = new CustomApplicationError();

      // Act
      const httpResponse = handleError(applicationError);

      // Assert
      expect(httpResponse).toEqual({
        body: {
          success: false,
          errorMessage: "Erro de aplicação customizado",
          metadata: {
            timestamp: "2023-01-01T00:00:00.000Z",
          },
        },
        statusCode: 422,
      });
    });

    it("deve retornar serverError quando o erro não é um ApplicationError", () => {
      // Arrange
      const regularError = new Error("Erro comum");

      // Act
      const httpResponse = handleError(regularError);

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.errorMessage).toBe("Erro comum");
      expect(httpResponse.body.success).toBe(false);
    });

    it("deve lidar corretamente com objetos que não são Error", () => {
      // Arrange
      const nonErrorObject = { message: "Não sou um erro" };

      // Act
      const httpResponse = handleError(nonErrorObject);

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
    });
  });
});
