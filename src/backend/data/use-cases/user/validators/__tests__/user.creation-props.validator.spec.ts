import {
  DateValidatorStub,
  EmailValidatorStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserCreationPropsValidator } from "@/backend/data/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserCreationPropsValidator;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de propriedades de criação de usuário
 */
describe("UserCreationPropsValidator", () => {
  let sut: UserCreationPropsValidator;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do validador e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const dateValidator = new DateValidatorStub();
    const emailValidator = new EmailValidatorStub();
    const phoneValidator = new PhoneValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const sut = new UserCreationPropsValidator({
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      errorsValidation,
    });

    return {
      sut,
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Cria um objeto com as propriedades padrão de usuário para os testes
   */
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => {
    return {
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
      ...overrides,
    };
  };

  /**
   * Testa a validação bem-sucedida das propriedades
   */
  test("should validate user creation props", async () => {
    const userProps = createUserProps();

    await expect(
      sut.validateUserCreationProps(userProps)
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de nome obrigatório
   */
  test("should throw if no name is provided", async () => {
    const userProps = createUserProps({ name: "" });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("nome")
    );
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should throw if no email is provided", async () => {
    const userProps = createUserProps({ email: "" });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("email")
    );
  });

  /**
   * Testa a validação de formato de email
   */
  test("should throw if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);
    const userProps = createUserProps();

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.invalidParamError("email")
    );
  });

  /**
   * Testa a validação de email já registrado
   */
  test("should throw if already registered email is provided", async () => {
    await userRepository.create(createUserProps());
    const userProps = createUserProps();

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  /**
   * Testa a validação de telefone obrigatório
   */
  test("should throw if no phone is provided", async () => {
    const userProps = createUserProps({ phone: "" });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("telefone")
    );
  });

  /**
   * Testa a validação de formato de telefone
   */
  test("should throw if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);
    const userProps = createUserProps();

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.invalidParamError("telefone")
    );
  });

  /**
   * Testa a validação de data de nascimento obrigatória
   */
  test("should throw if no birthdate is provided", async () => {
    const userProps = createUserProps({ birthdate: undefined });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("data de nascimento")
    );
  });

  /**
   * Testa a validação de maioridade
   */
  test("should throw if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);
    const userProps = createUserProps();

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.invalidParamError("data de nascimento")
    );
  });

  /**
   * Testa a validação de papel obrigatório
   */
  test("should throw if no role is provided", async () => {
    const userProps = createUserProps({ role: undefined });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("função")
    );
  });

  /**
   * Testa a validação de papel inválido
   */
  test("should throw if invalid role is provided", async () => {
    const userProps = createUserProps({ role: "invalid_role" as UserRole });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.invalidParamError("função")
    );
  });

  /**
   * Testa a validação de senha obrigatória
   */
  test("should throw if no password is provided", async () => {
    const userProps = createUserProps({ password: "" });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.missingParamError("senha")
    );
  });

  /**
   * Testa a validação de tamanho mínimo de senha
   */
  test("should throw if password with less than 8 characters is provided", async () => {
    const userProps = createUserProps({ password: "123456" });

    await expect(sut.validateUserCreationProps(userProps)).rejects.toThrow(
      errorsValidation.invalidParamError("senha")
    );
  });
});
