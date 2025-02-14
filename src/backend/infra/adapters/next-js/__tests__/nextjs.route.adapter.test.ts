import { Argon2EncrypterAdapter } from "../../cryptography";
import { NextRequest } from "next/server";
import { NextjsRouteAdapter } from "../nextjs.route.adapter";
import { PrismaUserRepository } from "@/backend/infra/repositories";
import { db } from "../../prisma-client";
import { makeAuthLoginController } from "@/backend/infra/factories";
import { subYears } from "date-fns";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: NextjsRouteAdapter;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const sut = new NextjsRouteAdapter();
  return { sut };
};

describe("NextjsRouteAdapter", () => {
  let sut: NextjsRouteAdapter;
  const authLoginController = makeAuthLoginController();

  beforeAll(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa o fluxo completo da requisição
   */
  describe("request flow", () => {
    test("should process login request correctly", async () => {
      const prismaUserRepository = new PrismaUserRepository(db);
      const argon2 = new Argon2EncrypterAdapter();
      const hashedPassword = await argon2.encrypt("valid_password");
      await prismaUserRepository.create({
        name: "valid_name",
        email: "valid_email@mail.com",
        phone: "valid_phone",
        birthdate: subYears(new Date(), 18),
        role: "cliente",
        password: hashedPassword,
      });
      const request = new Request("http://localhost:3000/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: "valid_email@mail.com",
          password: "valid_password",
        }),
      });

      const nextRequest = new NextRequest(request);
      const response = await sut.handle({
        request: nextRequest,
        controller: authLoginController,
      });

      const data = await response.json();
      expect(data.statusCode).toBe(204);
    });
  });
});
