import {
  ApplicationError,
  DatabaseError,
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";
import { errorHandler } from "../http";

/**
 * Controller de teste que usa o errorHandler para tratar diferentes tipos de erros
 */
class TestController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { errorType } = request.body || {};

      switch (errorType) {
        case "missing":
          throw new MissingParamError("nome");
        case "invalid":
          throw new InvalidParamError("email inválido");
        case "duplicate":
          throw new DuplicateResourceError("Email");
        case "database":
          throw new DatabaseError("Erro ao conectar ao banco de dados");
        case "application":
          throw new ApplicationError("Erro genérico da aplicação", 422);
        case "unknown":
          throw new Error("Erro desconhecido");
        default:
          return {
            statusCode: 200,
            body: {
              success: true,
              metadata: {
                timestamp: new Date().toISOString(),
              },
            },
          };
      }
    } catch (error) {
      // Usa o errorHandler para tratar o erro
      return errorHandler(error);
    }
  }
}

interface SutResponses {
  controller: TestController;
}

/**
 * Teste de integração para os helpers HTTP
 *
 * Este teste verifica a integração entre:
 * - Helpers HTTP (especialmente o errorHandler)
 * - Erros de domínio (ApplicationError e subclasses)
 * - Controllers que usam esses helpers
 */
describe("HTTP Helpers Integration", () => {
  const makeSut = (): SutResponses => {
    const controller = new TestController();
    return { controller };
  };

  describe("Integration with domain errors", () => {
    // Usando test.each para testar diferentes tipos de erros
    const errorCases = [
      {
        errorType: "missing",
        expectedStatus: 400,
        expectedMessage: "Parâmetro obrigatório não informado: nome",
        errorClass: MissingParamError,
      },
      {
        errorType: "invalid",
        expectedStatus: 400,
        expectedMessage: "Parâmetro inválido: email inválido",
        errorClass: InvalidParamError,
      },
      {
        errorType: "duplicate",
        expectedStatus: 409,
        expectedMessage: "Email já cadastrado no sistema",
        errorClass: DuplicateResourceError,
      },
      {
        errorType: "database",
        expectedStatus: 500,
        expectedMessage: "Erro ao conectar ao banco de dados",
        errorClass: DatabaseError,
      },
      {
        errorType: "application",
        expectedStatus: 422,
        expectedMessage: "Erro genérico da aplicação",
        errorClass: ApplicationError,
      },
      {
        errorType: "unknown",
        expectedStatus: 500,
        expectedMessage: "Erro interno do servidor",
        errorClass: Error,
      },
    ];

    test.each(errorCases)(
      "should handle $errorType error correctly",
      async ({ errorType, expectedStatus, expectedMessage }) => {
        const { controller } = makeSut();

        const request: HttpRequest = {
          body: { errorType },
        };

        const response = await controller.handle(request);

        expect(response.statusCode).toBe(expectedStatus);
        expect(response.body.success).toBe(false);
        expect(response.body.errorMessage).toBe(expectedMessage);
        expect(response.body.metadata).toBeDefined();
        expect(response.body.metadata.timestamp).toBeDefined();
      },
    );
  });

  describe("Success flow", () => {
    it("should allow controller to return a success response", async () => {
      const { controller } = makeSut();

      const request: HttpRequest = {
        body: { errorType: "none" },
      };

      const response = await controller.handle(request);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
