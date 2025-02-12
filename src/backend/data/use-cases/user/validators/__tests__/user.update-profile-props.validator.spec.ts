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
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserUpdateProfilePropsValidator } from "@/backend/data/use-cases";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdateProfilePropsValidator;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de propriedades de atualização de perfil
 */
describe("UserUpdateProfilePropsValidator", () => {
  let sut: UserUpdateProfilePropsValidator;
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

    const sut = new UserUpdateProfilePropsValidator({
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
   * Cria um usuário para os testes
   */
  const createUser = async () => {
    return await userRepository.create({
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
    });
  };

  /**
   * Testa a validação bem-sucedida das propriedades
   */
  test("should validate update profile props", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de nome obrigatório
   */
  test("should throw if no name is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.missingParamError("nome"));
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should throw if no email is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.missingParamError("email"));
  });

  /**
   * Testa a validação de formato de email
   */
  test("should throw if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "invalid_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.invalidParamError("email"));
  });

  /**
   * Testa a validação de email já registrado
   */
  test("should throw if already registered email is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    await userRepository.create({
      name: "other_name",
      email: "other_email",
      phone: "other_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
    });

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "other_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  /**
   * Testa a validação de telefone obrigatório
   */
  test("should throw if no phone is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.missingParamError("telefone"));
  });

  /**
   * Testa a validação de formato de telefone
   */
  test("should throw if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "invalid_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.invalidParamError("telefone"));
  });

  /**
   * Testa a validação de data de nascimento obrigatória
   */
  test("should throw if no birthdate is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.missingParamError("data de nascimento"));
  });

  /**
   * Testa a validação de maioridade
   */
  test("should throw if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(
      sut.validateUpdateProfileProps(updateProfileData)
    ).rejects.toThrow(errorsValidation.invalidParamError("data de nascimento"));
  });
});
