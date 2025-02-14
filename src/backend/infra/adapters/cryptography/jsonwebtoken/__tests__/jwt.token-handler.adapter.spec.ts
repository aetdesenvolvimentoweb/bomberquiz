import { AuthTokenHandlerUseCase } from "@/backend/domain/use-cases";
import { JwtTokenHandlerAdapter } from "../jwt.token-handler.adapter";
import { UserLogged } from "@/backend/domain/entities";
import jwt from "jsonwebtoken";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: AuthTokenHandlerUseCase;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const sut = new JwtTokenHandlerAdapter();
  return { sut };
};

describe("JwtTokenHandlerAdapter", () => {
  let sut: AuthTokenHandlerUseCase;

  /**
   * Cria dados mockados de usuário logado
   * @returns Dados do usuário logado
   */
  const mockUserLogged: UserLogged = {
    id: "valid_id",
    name: "valid_name",
    email: "valid_email",
    role: "cliente",
    password: "valid_password",
  };

  beforeAll(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa a geração de token
   */
  describe("generate", () => {
    test("should generate token with correct values", () => {
      const token = "valid_token";

      jest.spyOn(jwt, "sign").mockImplementation(() => token);

      const generatedToken = sut.generate(mockUserLogged);

      expect(generatedToken).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith(mockUserLogged, "segredo", {
        expiresIn: "1d",
        subject: mockUserLogged.id,
      });
    });

    test("should throw if sign throws", () => {
      jest.spyOn(jwt, "sign").mockImplementation(() => {
        throw new Error("Erro ao gerar token");
      });

      expect(() => sut.generate(mockUserLogged)).toThrow("Erro ao gerar token");
    });
  });

  /**
   * Testa a verificação de token
   */
  describe("verify", () => {
    test("should return user data if token is valid", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => mockUserLogged);

      const decodedToken = sut.verify("valid_token");

      expect(decodedToken).toEqual(mockUserLogged);
      expect(jwt.verify).toHaveBeenCalledWith("valid_token", "segredo");
    });

    test("should throw if verify throws", () => {
      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Token inválido");
      });

      expect(() => sut.verify("invalid_token")).toThrow("Token inválido");
    });
  });
});
