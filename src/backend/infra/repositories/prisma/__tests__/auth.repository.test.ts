import { AuthRepository, UserRepository } from "@/backend/data/repository";
import { PrismaAuthRepository } from "../auth.repository";
import { PrismaUserRepository } from "../user.repository";
import { UserProps } from "@/backend/domain/entities";
import { db } from "@/backend/infra/adapters";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: AuthRepository;
  userRepository: UserRepository;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const userRepository = new PrismaUserRepository(db);
  const sut = new PrismaAuthRepository(userRepository);
  return { sut, userRepository };
};

describe("PrismaAuthRepository", () => {
  let sut: AuthRepository;
  let userRepository: UserRepository;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
   */
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => ({
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
    ...overrides,
  });

  beforeAll(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    await db.user.deleteMany({});
  });

  /**
   * Testa a autorização de usuário
   */
  describe("authorize", () => {
    test("should return user if credentials are valid", async () => {
      await userRepository.create(createUserProps());

      const user = await sut.authorize({
        email: createUserProps().email,
        password: createUserProps().password,
      });

      expect(user).toBeTruthy();
      expect(user?.id).toBeTruthy();
      expect(user?.name).toBe(createUserProps().name);
      expect(user?.email).toBe(createUserProps().email);
      expect(user?.role).toBe(createUserProps().role);
      expect(user?.password).toBe(createUserProps().password);
    });

    test("should return null if user is not found", async () => {
      const user = await sut.authorize({
        email: "invalid_email",
        password: "any_password",
      });

      expect(user).toBeNull();
    });
  });
});
