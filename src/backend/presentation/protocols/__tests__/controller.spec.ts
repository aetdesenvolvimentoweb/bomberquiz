import { HttpRequest, HttpResponse } from "../http";
import { Controller } from "../controller";

// Classe concreta mínima para testar a interface
class TestController<T = unknown> implements Controller<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(request: HttpRequest<T>): Promise<HttpResponse<T>> {
    return Promise.resolve({
      statusCode: 200,
      body: {
        success: true,
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    });
  }
}

describe("Controller Interface", () => {
  it("should define required methods", () => {
    const controller = new TestController();

    // Verificar se os métodos existem
    expect(typeof controller.handle).toBe("function");
  });

  it("should be able to handle a request", async () => {
    const controller = new TestController();
    const handleSpy = jest.spyOn(controller, "handle");

    const request: HttpRequest = { body: { test: true } };

    await controller.handle(request);

    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  it("should return a valid HttpResponse", async () => {
    const controller = new TestController();

    const request: HttpRequest = { body: { test: true } };

    const response = await controller.handle(request);

    expect(response).toHaveProperty("statusCode");
    expect(response).toHaveProperty("body");
    expect(typeof response.statusCode).toBe("number");
  });
});
