import {
  DateValidatorStub,
  EmailValidatorStub,
  IdValidatorStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  IdValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UserIdValidator,
  UserUpdateProfilePropsValidator,
} from "@/backend/data/use-cases";
import { UserProfileProps, UserProps } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserUpdateProfileService } from "@/backend/data/services";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdateProfileService;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  idValidator: IdValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do serviço de atualização de perfil
 */
describe("UserUpdateProfileService", () => {
  let sut: UserUpdateProfileService;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do serviço e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const dateValidator = new DateValidatorStub();
    const emailValidator = new EmailValidatorStub();
    const idValidator = new IdValidatorStub();
    const phoneValidator = new PhoneValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const userIdValidator = new UserIdValidator({
      idValidator,
      userRepository,
      errorsValidation,
    });

    const updateProfilePropsValidator = new UserUpdateProfilePropsValidator({
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      errorsValidation,
    });

    const sut = new UserUpdateProfileService({
      updateProfilePropsValidator,
      userIdValidator,
      userRepository,
    });

    return {
      sut,
      dateValidator,
      emailValidator,
      idValidator,
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
    idValidator = sutInstance.idValidator;
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
   * Testa a atualização bem-sucedida de perfil
   */
  test("should update user profile", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).resolves.not.toThrow();
  });

  /**
   * Testa a validação de ID obrigatório
   */
  test("should throw if no id is provided", async () => {
    const updateProfileData = {
      id: "",
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.missingParamError("id")
    );
  });

  /**
   * Testa a validação de formato de ID
   */
  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const updateProfileData = {
      id: "invalid-id",
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.invalidParamError("id")
    );
  });

  /**
   * Testa a validação de ID não registrado
   */
  test("should throw if unregistered id is provided", async () => {
    const updateProfileData = {
      id: "unregistered-id",
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.unregisteredError("id")
    );
  });

  /**
   * Testa a validação de nome obrigatório
   */
  test("should throw if no name is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.missingParamError("nome")
    );
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should throw if no email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.missingParamError("email")
    );
  });

  /**
   * Testa a validação de formato de email
   */
  test("should throw if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "invalid_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.invalidParamError("email")
    );
  });

  /**
   * Testa a validação de email já registrado
   */
  test("should throw if already registered email is provided", async () => {
    await userRepository.create(createUserProps());
    await userRepository.create(createUserProps({ email: "another_email" }));
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "another_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
        .message
    );
  });

  /**
   * Testa a validação de telefone obrigatório
   */
  test("should throw if no phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.missingParamError("telefone")
    );
  });

  /**
   * Testa a validação de formato de telefone
   */
  test("should throw if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "invalid_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.invalidParamError("telefone")
    );
  });

  /**
   * Testa a validação de data de nascimento obrigatória
   */
  test("should throw if no birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.missingParamError("data de nascimento")
    );
  });

  /**
   * Testa a validação de maioridade
   */
  test("should throw if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateProfileData = {
      id: user!.id,
      props: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
    };

    await expect(sut.updateProfile(updateProfileData)).rejects.toThrow(
      errorsValidation.invalidParamError("data de nascimento")
    );
  });
});
