import {
  DateValidatorStub,
  EmailValidatorStub,
  EncrypterStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
  PhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { CreateUserController } from "@/backend/presentation/controllers";
import { CreateUserService } from "@/backend/data/services";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponses } from "@/backend/presentation/helpers";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: CreateUserController;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  httpResponses: HttpResponses;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const dateValidator: DateValidatorUseCase = new DateValidatorStub();
  const emailValidator: EmailValidatorUseCase = new EmailValidatorStub();
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const phoneValidator: PhoneValidatorUseCase = new PhoneValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userValidator = new UserCreationPropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  const createUserService: CreateUserService = new CreateUserService({
    encrypter,
    userRepository,
    userValidator,
  });
  const httpResponses = new HttpResponses();
  const sut = new CreateUserController({
    createUserService,
    httpResponses,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    httpResponses,
    phoneValidator,
    userRepository,
    validationErrors,
  };
};

describe("CreateUserController", () => {
  let sut: CreateUserController;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let httpResponses: HttpResponses;
  let phoneValidator: PhoneValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;

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
    httpResponses = sutInstance.httpResponses;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 201 if user was created", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    await expect(sut.handle(httpRequest)).resolves.toEqual(
      httpResponses.created()
    );
  });

  test("should return 400 if no name is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ name: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("nome").message
    );
  });

  test("should return 400 if no email is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ email: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("email").message
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
      validationErrors.invalidParamError("email").message
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
      validationErrors.duplicatedKeyError({ entity: "usuário", key: "email" })
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
      validationErrors.missingParamError("telefone").message
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
      validationErrors.invalidParamError("telefone").message
    );
  });

  test("should return 400 if no birthdate is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("data de nascimento").message
    );
  });

  test("should return 400 if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: new Date("invalid_birthdate") }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("data de nascimento").message
    );
  });

  test("should return 400 if no role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("função").message
    );
  });

  test("should return 400 if invalid role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: "invalid_role" as UserRole }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("função").message
    );
  });

  test("should return 400 if no password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("senha").message
    );
  });

  test("should return 400 if invalid password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: "invalid" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("senha").message
    );
  });
});
