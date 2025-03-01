import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataValidator } from "../user.create.data.validator";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";
import { UserPasswordValidator } from "../user.password.validator";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidator } from "../user.unique.email.validator";

interface SutResponses {
  userCreateDataValidator: UserCreateDataValidatorUseCase;
  userRepository: UserRepository;
  userBirthdateValidator: UserBirthdateValidatorMock;
  userEmailValidator: UserEmailValidatorMock;
  userPasswordValidator: UserPasswordValidator;
  userPhoneValidator: UserPhoneValidatorMock;
  userUniqueEmailValidator: UserUniqueEmailValidator;
}

/**
 * Teste de integração para o validador de criação de usuário
 *
 * Este teste verifica a integração entre:
 * - UserCreateDataValidator (validador composto)
 * - Validadores específicos (email, senha, telefone, data de nascimento)
 * - UserUniqueEmailValidator (validador de email único)
 * - InMemoryUserRepository (repositório)
 */
describe("UserCreateDataValidator Integration", () => {
  const makeSut = (): SutResponses => {
    const userRepository = new InMemoryUserRepository();
    const userBirthdateValidator = new UserBirthdateValidatorMock();
    const userEmailValidator = new UserEmailValidatorMock();
    const userPasswordValidator = new UserPasswordValidator();
    const userPhoneValidator = new UserPhoneValidatorMock();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(
      userRepository,
    );

    const userCreateDataValidator = new UserCreateDataValidator({
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    });

    return {
      userCreateDataValidator,
      userRepository,
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    };
  };

  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(11) 99999-9999",
    birthdate: new Date("1990-01-01"),
    password: "Password123!",
  });

  describe("Required fields validation", () => {
    // Usando test.each para testar campos obrigatórios
    const requiredFields = [
      { field: "name", label: "nome" },
      { field: "email", label: "email" },
      { field: "phone", label: "telefone" },
      { field: "birthdate", label: "data de nascimento" },
      { field: "password", label: "senha" },
    ];

    test.each(requiredFields)(
      "should throw MissingParamError when $field is missing",
      async ({ field, label }) => {
        const { userCreateDataValidator } = makeSut();
        const userData = { ...makeValidUserData() };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (userData as any)[field];

        await expect(
          userCreateDataValidator.validate(userData),
        ).rejects.toThrow(MissingParamError);
        await expect(
          userCreateDataValidator.validate(userData),
        ).rejects.toThrow(`Parâmetro obrigatório não informado: ${label}`);
      },
    );

    it("should validate complete data without throwing exceptions", async () => {
      const { userCreateDataValidator } = makeSut();
      const userData = makeValidUserData();

      await expect(
        userCreateDataValidator.validate(userData),
      ).resolves.not.toThrow();
    });
  });

  describe("Field format validation", () => {
    it("should call birthdate validator", async () => {
      const { userCreateDataValidator, userBirthdateValidator } = makeSut();
      const validateSpy = jest.spyOn(userBirthdateValidator, "validate");
      const userData = makeValidUserData();

      await userCreateDataValidator.validate(userData);

      expect(validateSpy).toHaveBeenCalledWith(userData.birthdate);
    });

    it("should call email validator", async () => {
      const { userCreateDataValidator, userEmailValidator } = makeSut();
      const validateSpy = jest.spyOn(userEmailValidator, "validate");
      const userData = makeValidUserData();

      await userCreateDataValidator.validate(userData);

      expect(validateSpy).toHaveBeenCalledWith(userData.email);
    });

    it("should call password validator", async () => {
      const { userCreateDataValidator, userPasswordValidator } = makeSut();
      const validateSpy = jest.spyOn(userPasswordValidator, "validate");
      const userData = makeValidUserData();

      await userCreateDataValidator.validate(userData);

      expect(validateSpy).toHaveBeenCalledWith(userData.password);
    });

    it("should call phone validator", async () => {
      const { userCreateDataValidator, userPhoneValidator } = makeSut();
      const validateSpy = jest.spyOn(userPhoneValidator, "validate");
      const userData = makeValidUserData();

      await userCreateDataValidator.validate(userData);

      expect(validateSpy).toHaveBeenCalledWith(userData.phone);
    });

    it("should throw InvalidParamError when password is too short", async () => {
      const { userCreateDataValidator } = makeSut();
      const userData = makeValidUserData();
      userData.password = "123"; // Senha muito curta

      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        InvalidParamError,
      );
      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        "Parâmetro inválido: senha deve ter no mínimo 8 caracteres",
      );
    });
  });

  describe("Unique email validation", () => {
    it("should call unique email validator", async () => {
      const { userCreateDataValidator, userUniqueEmailValidator } = makeSut();
      const validateSpy = jest.spyOn(userUniqueEmailValidator, "validate");
      const userData = makeValidUserData();

      await userCreateDataValidator.validate(userData);

      expect(validateSpy).toHaveBeenCalledWith({ email: userData.email });
    });

    it("should throw DuplicateResourceError when email is already registered", async () => {
      const { userCreateDataValidator, userRepository } = makeSut();
      const userData = makeValidUserData();

      // Criar um usuário com o mesmo email
      await userRepository.create(userData);

      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        DuplicateResourceError,
      );
      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        "Email já cadastrado no sistema",
      );
    });
  });

  describe("Validation order", () => {
    it("should check required fields before validating format", async () => {
      const { userCreateDataValidator, userEmailValidator } = makeSut();
      const validateSpy = jest.spyOn(userEmailValidator, "validate");
      const userData = { ...makeValidUserData() };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (userData as any).name;

      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        MissingParamError,
      );
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it("should validate format before checking unique email", async () => {
      const { userCreateDataValidator, userUniqueEmailValidator } = makeSut();
      const validateSpy = jest.spyOn(userUniqueEmailValidator, "validate");
      const userData = makeValidUserData();
      userData.password = "123"; // Senha muito curta

      await expect(userCreateDataValidator.validate(userData)).rejects.toThrow(
        InvalidParamError,
      );
      expect(validateSpy).not.toHaveBeenCalled();
    });
  });
});
