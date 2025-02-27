import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateService } from "../user.create.service";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateValidator } from "@/backend/data/validators";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

interface SutResponses {
  sut: UserCreateUseCase;
}

const makeSut = (): SutResponses => {
  const repository: UserRepository = new InMemoryUserRepository();
  const sanitizer: UserCreateDataSanitizerUseCase =
    new UserCreateDataSanitizer();
  const validator: UserCreateValidatorUseCase = new UserCreateValidator();
  const sut = new UserCreateService({
    repository,
    sanitizer,
    validator,
  });

  return { sut };
};

describe("UserCreateService", () => {
  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123456789",
    birthdate: new Date(),
    password: "password123",
  });

  it("should create a user", async () => {
    const { sut } = makeSut();
    const data = makeValidUserData();
    await expect(sut.create(data)).resolves.not.toThrow();
  });
});
