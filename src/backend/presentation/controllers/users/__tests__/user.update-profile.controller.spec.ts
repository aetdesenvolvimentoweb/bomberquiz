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
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UserIdValidator,
  UserUpdateProfilePropsValidator,
} from "@/backend/data/use-cases";
import { UserProfileProps, UserProps } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";
import { UserUpdateProfileController } from "@/backend/presentation/controllers";
import { UserUpdateProfileService } from "@/backend/data/services";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: UserUpdateProfileController;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  idValidator: IdValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
  userUpdateProfileService: UserUpdateProfileService;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Cria uma instância do sistema em teste e suas dependências
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const idValidator = new IdValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const httpResponsesHelper = new HttpResponsesHelper();

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

  const userUpdateProfileService = new UserUpdateProfileService({
    updateProfilePropsValidator,
    userIdValidator,
    userRepository,
  });

  const sut = new UserUpdateProfileController({
    userUpdateProfileService,
    httpResponsesHelper,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    idValidator,
    phoneValidator,
    userRepository,
    errorsValidation,
    userUpdateProfileService,
    httpResponsesHelper,
  };
};

describe("UserUpdateProfileController", () => {
  let sut: UserUpdateProfileController;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;
  let userUpdateProfileService: UserUpdateProfileService;
  let httpResponsesHelper: HttpResponsesHelper;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
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

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
    idValidator = sutInstance.idValidator;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
    userUpdateProfileService = sutInstance.userUpdateProfileService;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
  });

  /**
   * Testa o cenário de sucesso na atualização do perfil
   */
  test("should return 204 if user profile was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      },
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponsesHelper.noContent());
  });

  /**
   * Testa o cenário de erro quando nenhum ID é fornecido
   */
  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      },
      dynamicParams: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando um ID inválido é fornecido
   */
  test("should return 400 if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      },
      dynamicParams: { id: "invalid_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando um ID não registrado é fornecido
   */
  test("should return 404 if unregistered id is provided", async () => {
    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      },
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unregisteredError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo nome do usuário não é fornecido
   */
  test("should return 400 if no name is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("nome").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo email do usuário não é fornecido
   */
  test("should return 400 if no email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("email").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo email do usuário é inválido
   */
  test("should return 400 if invalid email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("email").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo telefone do usuário não é fornecido
   */
  test("should return 400 if no phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("telefone").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo telefone do usuário é inválido
   */
  test("should return 400 if invalid phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("telefone").message
    );
  });

  /**
   * Testa o cenário de erro quando o novo email do usuário não é fornecido
   */
  test("should return 400 if no birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("data de nascimento").message
    );
  });

  /**
   * Testa o cenário de erro quando a nova data de nascimento do usuário é inválida(menor de 18 anos)
   */
  test("should return 400 if invalid birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date("invalid_birthdate"),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("data de nascimento").message
    );
  });

  /**
   * Testa o cenário de erro interno do servidor
   */
  test("should return 500 when unknown error occurs", async () => {
    jest
      .spyOn(userUpdateProfileService, "updateProfile")
      .mockRejectedValueOnce(new Error("server_error"));

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      },
      dynamicParams: { id: "any_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toEqual(
      httpResponsesHelper.serverError().body.error
    );
  });
});
