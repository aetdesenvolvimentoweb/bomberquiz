import { DuplicateResourceError } from "@/backend/domain/errors";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidator } from "../user.unique.email.validator";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

interface SutResponses {
  sut: UserUniqueEmailValidatorUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutResponses => {
  const userRepository = new InMemoryUserRepository();
  const sut = new UserUniqueEmailValidator(userRepository);
  return { sut, userRepository };
};

describe("UserUniqueEmailValidator", () => {
  const makeValidUserData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "any_phone",
    birthdate: new Date(),
    password: "any_password",
  });

  describe("Validate unique email", () => {
    // Casos de teste para validação de email duplicado
    const emailTestCases = [
      {
        scenario: "duplicated email",
        shouldThrow: true,
        errorMessage: "Email",
      },
      {
        scenario: "unique email",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(emailTestCases)(
      "should handle email with $scenario",
      async ({ shouldThrow, errorMessage }) => {
        const { sut, userRepository } = makeSut();
        const validData = makeValidUserData();

        if (shouldThrow) {
          await userRepository.create(validData);

          await expect(sut.validate(validData)).rejects.toThrow(
            new DuplicateResourceError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });
});
