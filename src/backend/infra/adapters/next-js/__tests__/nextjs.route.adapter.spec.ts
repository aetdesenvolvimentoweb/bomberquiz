/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";
import { NextRequest } from "next/server";
import { NextjsRouteAdapter } from "../nextjs.route.adapter";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: NextjsRouteAdapter;
  controllerStub: Controller;
}

/**
 * Cria um controller mockado para testes
 * @returns Controller mockado
 */
const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve({
        statusCode: 200,
        body: { data: "any_data" },
      });
    }
  }
  return new ControllerStub();
};

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new NextjsRouteAdapter();
  return { sut, controllerStub };
};

describe("NextjsRouteAdapter", () => {
  let sut: NextjsRouteAdapter;
  let controllerStub: Controller;

  beforeAll(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    controllerStub = sutInstance.controllerStub;
  });

  /**
   * Testa o método handle
   */
  describe("handle", () => {
    test("should call controller with correct values", async () => {
      const request = {
        method: "POST",
        json: () => Promise.resolve({ any: "data" }),
      } as NextRequest;

      const handleSpy = jest.spyOn(controllerStub, "handle");

      await sut.handle({ request, controller: controllerStub });

      expect(handleSpy).toHaveBeenCalledWith({
        body: { any: "data" },
        dynamicParams: undefined,
      });
    });

    test("should return correct response on success", async () => {
      const request = {
        method: "GET",
      } as NextRequest;

      const response = await sut.handle({
        request,
        controller: controllerStub,
      });
      const jsonResponse = await response.json();

      expect(jsonResponse).toEqual({
        statusCode: 200,
        body: { data: "any_data" },
      });
    });

    test("should set cookie when token is present", async () => {
      const request = {
        method: "POST",
        json: () => Promise.resolve({ any: "data" }),
      } as NextRequest;

      jest.spyOn(controllerStub, "handle").mockResolvedValueOnce({
        statusCode: 200,
        body: { data: "any_data" },
        headers: { tokenJwt: "any_token" },
      });

      const response = await sut.handle({
        request,
        controller: controllerStub,
      });

      expect(response.cookies.get("_BomberQuiz_Session_Token")).toBeTruthy();
    });

    test("should handle dynamic params correctly", async () => {
      const request = {
        method: "GET",
      } as NextRequest;

      const dynamicParams = { id: "any_id" };
      const handleSpy = jest.spyOn(controllerStub, "handle");

      await sut.handle({
        request,
        controller: controllerStub,
        dynamicParams,
      });

      expect(handleSpy).toHaveBeenCalledWith({
        body: {},
        dynamicParams,
      });
    });
  });
});
