import { AuthRepository, UserRepository } from "@/backend/data/repository";
import { LoginProps, UserLogged, UserRole } from "@/backend/domain/entities";
import { PrismaAuthRepository } from "../auth.repository";
import { PrismaUserRepository } from "../user.repository";
import { createMockContext } from "@/backend/__mocks__";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: AuthRepository;
  userRepository: UserRepository;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const mockContext = createMockContext();
  const userRepository = new PrismaUserRepository(mockContext.prisma);
  const sut = new PrismaAuthRepository(userRepository);
  return { sut, userRepository };
};

describe("PrismaAuthRepository", () => {
  let sut: AuthRepository;
  let userRepository: UserRepository;

  /**
   * Cria propriedades padrão para login
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades de login
   */
  const createLoginProps = (
    overrides: Partial<LoginProps> = {}
  ): LoginProps => ({
    email: "valid_email",
    password: "valid_password",
    ...overrides,
  });

  beforeAll(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
  });

  /**
   * Testa a autorização de usuário
   */
  describe("authorize", () => {
    test("should authorize user with valid credentials", async () => {
      const loginProps = createLoginProps();
      const authorizedUser: UserLogged = {
        id: "valid_id",
        name: "valid_name",
        email: loginProps.email,
        role: "cliente" as UserRole,
        password: loginProps.password,
      };

      jest.spyOn(userRepository, "findByEmail").mockResolvedValue({
        ...authorizedUser,
        phone: "valid_phone",
        role: authorizedUser.role as UserRole,
        password: authorizedUser.password!,
        birthdate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await sut.authorize(loginProps);

      expect(result).toEqual(authorizedUser);
    });

    test("should return null for non-existent user", async () => {
      const loginProps = createLoginProps();

      jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

      const result = await sut.authorize(loginProps);

      expect(result).toBeNull();
    });

    test("should throw on database error", async () => {
      const loginProps = createLoginProps();

      jest
        .spyOn(userRepository, "findByEmail")
        .mockRejectedValue(new Error("Erro ao consultar usuário"));

      await expect(sut.authorize(loginProps)).rejects.toThrow(
        "Erro ao consultar usuário"
      );
    });
  });
});
