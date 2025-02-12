import {
  DateValidatorStub,
  EmailValidatorStub,
  EncrypterStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { CreateUserController } from "@/backend/presentation/controllers";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserCreateService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

interface SutTypes {
  sut: CreateUserController;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const dateValidator: DateValidatorUseCase = new DateValidatorStub();
  const emailValidator: EmailValidatorUseCase = new EmailValidatorStub();
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const phoneValidator: UserPhoneValidatorUseCase = new PhoneValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const userCreationPropsValidator = new UserCreationPropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    errorsValidation,
  });
  const userCreateService: UserCreateService = new UserCreateService({
    encrypter,
    userRepository,
    userCreationPropsValidator,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new CreateUserController({
    userCreateService,
    httpResponsesHelper,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    httpResponsesHelper,
    phoneValidator,
    userRepository,
    errorsValidation,
  };
};

describe("CreateUserController", () => {
  let sut: CreateUserController;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;

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
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  test("should return 201 if user was created", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    await expect(sut.handle(httpRequest)).resolves.toEqual(
      httpResponsesHelper.created()
    );
  });

  test("should return 400 if no name is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ name: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("nome").message
    );
  });

  test("should return 400 if no email is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ email: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("email").message
    );
  });

  test("should return 400 if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ email: "invalid_email" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("email").message
    );
  });

  test("should return 400 if already registered email is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
        .message
    );
  });

  test("should return 400 if no phone is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ phone: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("telefone").message
    );
  });

  test("should return 400 if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ phone: "invalid_phone" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("telefone").message
    );
  });

  test("should return 400 if no birthdate is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("data de nascimento").message
    );
  });

  test("should return 400 if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: new Date("invalid_birthdate") }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("data de nascimento").message
    );
  });

  test("should return 400 if no role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("função").message
    );
  });

  test("should return 400 if invalid role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: "invalid_role" as UserRole }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("função").message
    );
  });

  test("should return 400 if no password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("senha").message
    );
  });

  test("should return 400 if invalid password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: "invalid" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("senha").message
    );
  });
});
