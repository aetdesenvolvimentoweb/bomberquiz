import { UserFindAllService } from "@/backend/data/services";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserFindAllService;
  userRepository: UserRepository;
}

/**
 * Testes do serviço de listagem de usuários
 */
describe("UserFindAllService", () => {
  let sut: UserFindAllService;
  let userRepository: UserRepository;

  /**
   * Cria uma instância do serviço e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const userRepository = new UserRepositoryInMemory();
    const sut = new UserFindAllService({
      userRepository,
    });

    return {
      sut,
      userRepository,
    };
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
  });

  /**
   * Propriedades padrão de usuário para os testes
   */
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  /**
   * Testa a listagem bem-sucedida de usuários
   */
  test("should list users", async () => {
    await userRepository.create(createUserProps);

    await expect(sut.findAll()).resolves.not.toThrow();
  });

  /**
   * Testa o retorno correto dos dados do usuário
   */
  test("should list users with correct data", async () => {
    await userRepository.create(createUserProps);

    const usersListed = await sut.findAll();

    expect(usersListed.length).not.toBeLessThan(1);
    expect(usersListed[0]).toHaveProperty("id");
    expect(usersListed[0]?.name).toEqual(createUserProps.name);
    expect(usersListed[0]?.email).toEqual(createUserProps.email);
    expect(usersListed[0]?.phone).toEqual(createUserProps.phone);
    expect(usersListed[0]?.birthdate).toEqual(createUserProps.birthdate);
    expect(usersListed[0]?.role).toEqual(createUserProps.role);
    expect(usersListed[0]).not.toHaveProperty("password");
  });
});
