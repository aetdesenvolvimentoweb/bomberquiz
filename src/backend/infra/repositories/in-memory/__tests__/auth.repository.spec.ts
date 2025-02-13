import { AuthRepositoryInMemory } from "../auth.repository";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "../user.repository";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: AuthRepositoryInMemory;
  userRepository: UserRepository;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const userRepository = new UserRepositoryInMemory();
  const sut = new AuthRepositoryInMemory(userRepository);
  return { sut, userRepository };
};

describe("AuthRepositoryInMemory", () => {
  let sut: AuthRepositoryInMemory;
  let userRepository: UserRepository;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
   */
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => {
    return {
      name: "any_name",
      email: "any_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
      ...overrides,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
  });

  /**
   * Testa a autorização de usuário
   */
  describe("authorize", () => {
    test("should return null if user not found", async () => {
      const auth = await sut.authorize({
        email: "any_email",
        password: "any_password",
      });
      expect(auth).toBeNull();
    });

    test("should return user if found", async () => {
      const userProps = createUserProps();
      await userRepository.create(userProps);

      const auth = await sut.authorize({
        email: userProps.email,
        password: userProps.password,
      });

      expect(auth).toBeTruthy();
      expect(auth?.id).toBeTruthy();
      expect(auth?.name).toBe(userProps.name);
      expect(auth?.email).toBe(userProps.email);
      expect(auth?.role).toBe(userProps.role);
      expect(auth?.password).toBe(userProps.password);
    });
  });
});
