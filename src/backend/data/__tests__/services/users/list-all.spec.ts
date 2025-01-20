import { ListAllUsersService } from "@/backend/data/services";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

interface SutTypes {
  sut: ListAllUsersService;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const userRepository = new UserRepositoryInMemory();
  const sut = new ListAllUsersService({
    userRepository,
  });

  return {
    sut,
    userRepository,
  };
};

describe("ListAllUsersService", () => {
  let sut: ListAllUsersService;
  let userRepository: UserRepository;
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
  });

  test("should list a user by id", async () => {
    await userRepository.create(createUserProps);

    await expect(sut.listAll()).resolves.not.toThrow();
  });
});
