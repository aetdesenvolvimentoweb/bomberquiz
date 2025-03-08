import {
  UserBirthdateValidatorUseCase,
  UserCreateDataValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUniqueEmailValidatorUseCase,
} from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataValidator } from "../user.create.data";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";

interface SutResponses {
  sut: UserCreateDataValidatorUseCase;
  userBirthdateValidator: UserBirthdateValidatorUseCase;
  userEmailValidator: UserEmailValidatorUseCase;
  userPhoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  userUniqueEmailValidator: UserUniqueEmailValidatorUseCase;
  userPasswordValidator: UserPasswordValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const userBirthdateValidator = jest.mocked<UserBirthdateValidatorUseCase>({
    validate: jest.fn(),
  });
  const userEmailValidator = jest.mocked<UserEmailValidatorUseCase>({
    validate: jest.fn(),
  });
  const userPasswordValidator = jest.mocked<UserPasswordValidatorUseCase>({
    validate: jest.fn(),
  });
  const userPhoneValidator = jest.mocked<UserPhoneValidatorUseCase>({
    validate: jest.fn(),
  });
  const userUniqueEmailValidator = jest.mocked<UserUniqueEmailValidatorUseCase>(
    {
      validate: jest.fn(),
    },
  );
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
    userUniqueEmailValidator,
    userPasswordValidator,
  };
};

describe("UserCreateDataValidator", () => {
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email",
    phone: "any_phone",
    birthdate: new Date(),
    password: "any_password",
  });

  let sut: UserCreateDataValidatorUseCase;
  let userBirthdateValidator: UserBirthdateValidatorUseCase;
  let userEmailValidator: UserEmailValidatorUseCase;
  let userPhoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let userUniqueEmailValidator: UserUniqueEmailValidatorUseCase;
  let userPasswordValidator: UserPasswordValidatorUseCase;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userBirthdateValidator = sutInstance.userBirthdateValidator;
    userEmailValidator = sutInstance.userEmailValidator;
    userPhoneValidator = sutInstance.userPhoneValidator;
    userRepository = sutInstance.userRepository;
    userUniqueEmailValidator = sutInstance.userUniqueEmailValidator;
    userPasswordValidator = sutInstance.userPasswordValidator;
  });

  describe("validate required fields", () => {
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
        const validData = makeUserCreateData();
        const invalidData = omitField(field, validData);

        await expect(sut.validate(invalidData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );

    it("should not throw if all required fields are provided", async () => {
      const validData = makeUserCreateData();

      await expect(sut.validate(validData)).resolves.not.toThrow();
    });
  });

  describe("Validate email format", () => {
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
        const validData = makeUserCreateData();
        validData.email = email;

        if (shouldThrow) {
          jest
            .spyOn(userEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
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
        const validData = makeUserCreateData();

        if (shouldThrow) {
          await userRepository.create(validData);
          jest
            .spyOn(userUniqueEmailValidator, "validate")
            .mockImplementationOnce(() => {
              throw new DuplicateResourceError(errorMessage);
            });

          await expect(sut.validate(validData)).rejects.toThrow(
            new DuplicateResourceError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate phone format", () => {
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
        const validData = makeUserCreateData();
        validData.phone = phone;

        if (shouldThrow) {
          jest
            .spyOn(userPhoneValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate birthdate format", () => {
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
        const validData = makeUserCreateData();
        validData.birthdate = birthdate;

        if (shouldThrow) {
          jest
            .spyOn(userBirthdateValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });

          await expect(sut.validate(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });

  describe("Validate password format", () => {
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
        const validData = makeUserCreateData();
        validData.password = password;

        if (shouldThrow) {
          jest
            .spyOn(userPasswordValidator, "validate")
            .mockImplementationOnce(() => {
              throw new InvalidParamError(errorMessage);
            });
          await expect(sut.validate(validData)).rejects.toThrow(
            new InvalidParamError(errorMessage),
          );
        } else {
          await expect(sut.validate(validData)).resolves.not.toThrow();
        }
      },
    );
  });
});
