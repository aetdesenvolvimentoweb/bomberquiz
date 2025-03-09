import { UserUniqueEmailValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

interface SutResponse {
  sut: UserUniqueEmailValidatorUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutResponse => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const sut = new UserUniqueEmailValidator(userRepository);

  return {
    sut,
    userRepository,
  };
};

describe("UserUniqueEmailValidator", () => {
  it("should call UserRepository with correct email", async () => {
    const { sut, userRepository } = makeSut();
    const email = "any_email@mail.com";
    await sut.validate(email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it("should throw if UserRepository returns a user", async () => {
    const { sut, userRepository } = makeSut();
    const email = "any_email@mail.com";
    jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
      id: "any_id",
      name: "any_name",
      email: "any_email@mail.com",
      phone: "any_phone",
      birthdate: new Date(),
      password: "any_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(sut.validate(email)).rejects.toThrow();
  });
});
