import {
  UserBirthdateValidatorUseCase,
  UserCreateDataValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataValidator } from "../user.create.data";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserPasswordValidator } from "../user.password.validator";
import { UserUniqueEmailValidator } from "../user.unique.email.validator";

interface SutResponses {
  sut: UserCreateDataValidatorUseCase;
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutResponses => {
  const userRepository = new InMemoryUserRepository();
  const userBirthdateValidator = jest.mocked<UserBirthdateValidatorUseCase>({
    validate: jest.fn(),
  });
  const userEmailValidator = jest.mocked<UserEmailValidatorUseCase>({
    validate: jest.fn(),
  });
  const userPhoneValidator = jest.mocked<UserPhoneValidatorUseCase>({
    validate: jest.fn(),
  });
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userPasswordValidator = new UserPasswordValidator();
  const sut = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });

  return {
    sut,
    userBirthdateValidator,
    userEmailValidator,
    userPhoneValidator,
    userRepository,
  };
};

describe("UserCreateDataValidator", () => {
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email@mail.com",
    phone: "(99) 99999-9999",
    birthdate: new Date("2007-01-01T00:00:00.000Z"),
    password: "P@ssw0rd",
  });

  let sut: UserCreateDataValidatorUseCase;
  let userBirthdateValidator: UserBirthdateValidatorUseCase;
  let userEmailValidator: UserEmailValidatorUseCase;
  let userPhoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userBirthdateValidator = sutInstance.userBirthdateValidator;
    userEmailValidator = sutInstance.userEmailValidator;
    userPhoneValidator = sutInstance.userPhoneValidator;
    userRepository = sutInstance.userRepository;
  });

  describe("validate required fields", () => {
    const userCreateData = makeUserCreateData();

    // Mapa de campos para labels
    const fieldToLabelMap: Record<string, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Função genérica para omitir um campo
    const omitField = (field: string, data: UserCreateData) => {
      return Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== field),
      ) as UserCreateData;
    };

    // Cria os casos de teste a partir do mapa
    const testCases = Object.entries(fieldToLabelMap).map(([field, label]) => ({
      field,
      label,
    }));

    test.each(testCases)(
      "should throw a MissingParamError if $field is not provided",
      async ({ field, label }) => {
        const invalidData = omitField(field, userCreateData);

        await expect(sut.validate(invalidData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );

    it("should not throw if all required fields are provided", async () => {
      await expect(sut.validate(userCreateData)).resolves.not.toThrow();
    });
  });

  describe("Validate email format", () => {
    const userCreateData = makeUserCreateData();

    // Casos de teste para validação de email
    const emailTestCases = [
      {
        scenario: "invalid email",
        email: "invalid-email",
        shouldThrow: true,
        errorMessage: "email inválido.",
      },
      {
        scenario: "valid email",
        email: "email@example.com",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(emailTestCases)(
      "should handle email with $scenario",
      async ({ email, shouldThrow, errorMessage }) => {
        userCreateData.email = email;

        if (shouldThrow) {
          jest
            .spyOn(userEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate unique email", () => {
    const userCreateData = makeUserCreateData();

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
        if (shouldThrow) {
          await userRepository.create(userCreateData);

          await expect(sut.validate(userCreateData)).rejects.toThrow(
            new DuplicateResourceError(errorMessage),
          );
        } else {
          await expect(sut.validate(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate phone format", () => {
    const userCreateData = makeUserCreateData();

    // Casos de teste para validação de telefone
    const phoneTestCases = [
      {
        scenario: "invalid phone",
        phone: "invalid-phone",
        shouldThrow: true,
        errorMessage: "telefone inválido.",
      },
      {
        scenario: "valid mobile phone",
        phone: "(62) 99999-9999",
        shouldThrow: false,
        errorMessage: "",
      },
      {
        scenario: "valid phone",
        phone: "(62) 9999-9999",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(phoneTestCases)(
      "should handle phone with $scenario",
      async ({ phone, shouldThrow, errorMessage }) => {
        userCreateData.phone = phone;

        if (shouldThrow) {
          jest
            .spyOn(userPhoneValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate birthdate format", () => {
    const userCreateData = makeUserCreateData();

    // Casos de teste para validação de data de nascimento
    const birthdateTestCases = [
      {
        scenario: "invalid date",
        birthdate: "invalid-date" as unknown as Date,
        shouldThrow: true,
        errorMessage: "data de nascimento inválida.",
      },
      {
        scenario: "birthdate less then 18 years old",
        birthdate: new Date(),
        shouldThrow: true,
        errorMessage: "",
      },
      {
        scenario: "valid birthdate",
        birthdate: new Date("2000-01-01"),
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(birthdateTestCases)(
      "should handle birthdate with $scenario",
      async ({ birthdate, shouldThrow, errorMessage }) => {
        userCreateData.birthdate = birthdate;

        if (shouldThrow) {
          jest
            .spyOn(userBirthdateValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate password format", () => {
    const userCreateData = makeUserCreateData();

    // Casos de teste para validação de senha
    const passwordTestCases = [
      {
        scenario: "less than 8 characters",
        password: "1234567",
        shouldThrow: true,
        errorMessage: "senha deve ter no mínimo 8 caracteres",
      },
      {
        scenario: "without uppercase letter",
        password: "1234567a",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra maiúscula",
      },
      {
        scenario: "without lowercase letter",
        password: "1234567B",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos uma letra minúscula",
      },
      {
        scenario: "without number",
        password: "ABCDEFab",
        shouldThrow: true,
        errorMessage: "senha deve ter pelo menos um número",
      },
      {
        scenario: "without special character",
        password: "ABC123abc",
        shouldThrow: true,
        errorMessage:
          "senha deve ter pelo menos um caractere especial (@, #, $, %, etc.)",
      },
      {
        scenario: "exactly 8 characters",
        password: "AB12ab%*",
        shouldThrow: false,
        errorMessage: "",
      },
      {
        scenario: "more than 8 characters",
        password: "ABC123abc@",
        shouldThrow: false,
        errorMessage: "",
      },
    ];

    test.each(passwordTestCases)(
      "should handle password with $scenario",
      async ({ password, shouldThrow, errorMessage }) => {
        userCreateData.password = password;

        if (shouldThrow) {
          await expect(sut.validate(userCreateData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(userCreateData)).resolves.not.toThrow();
        }
      },
    );
  });
});
