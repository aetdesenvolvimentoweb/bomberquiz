import {
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  UserCreateData,
} from "@/backend/domain/entities";
import { UserCreateService } from "../create";
import { UserRepository } from "@/backend/domain/repositories";
import { LoggerProvider } from "@/backend/domain/providers";

interface SutTypes {
  sut: UserCreateService;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const loggerProvider = jest.mocked<LoggerProvider>({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  });
  const sut = new UserCreateService({ userRepository, loggerProvider });
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
  const userRepository = sutInstance.userRepository;

  describe("success case", () => {
    it("should create a new user", async () => {
      await expect(sut.create(makeUserCreateData())).resolves.not.toThrow();
    });

    it("should call UserRepository.create with correct values", async () => {
      const userCreateData = makeUserCreateData();
      await sut.create(userCreateData);
      expect(userRepository.create).toHaveBeenCalledWith(userCreateData);
    });

    it("should create user with correct values", async () => {
      const userCreateData = makeUserCreateData();
      jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
        ...userCreateData,
        id: "any_id",
        avatarUrl: USER_DEFAULT_AVATAR_URL,
        role: USER_DEFAULT_ROLE,
        password: "hashed_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await sut.create(userCreateData);
      const user = await userRepository.findByEmail(userCreateData.email);
      expect(user).toEqual(
        expect.objectContaining({
          ...userCreateData,
          password: "hashed_password",
        }),
      );
    });
  });
});
