import { AuthTokenHandlerUseCase } from "@/backend/domain/use-cases";
import { JwtTokenHandlerAdapter } from "../jwt.token-handler.adapter";
import { UserLogged } from "@/backend/domain/entities";

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
   * Testa o fluxo completo de token
   */
  describe("token flow", () => {
    test("should generate and verify token correctly", () => {
      const token = sut.generate(mockUserLogged);

      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");

      const decodedToken = sut.verify(token);

      expect(decodedToken).toMatchObject({
        id: mockUserLogged.id,
        name: mockUserLogged.name,
        email: mockUserLogged.email,
        role: mockUserLogged.role,
      });
    });

    test("should throw on invalid token", () => {
      expect(() => sut.verify("invalid_token")).toThrow();
    });
  });
});
