import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateService } from "../create";
import { UserRepository } from "@/backend/domain/repositories";

interface SutTypes {
  sut: UserCreateService;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const sut = new UserCreateService({ userRepository });
  return {
    sut,
    userRepository,
  };
};

describe("UserCreateService", () => {
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "any_phone",
    birthdate: new Date(),
    password: "any_password",
  });

  const sutInstance = makeSut();
  const sut = sutInstance.sut;

  describe("success case", () => {
    it("should create a new user", async () => {
      await expect(sut.create(makeUserCreateData())).resolves.not.toThrow();
    });
  });
});
