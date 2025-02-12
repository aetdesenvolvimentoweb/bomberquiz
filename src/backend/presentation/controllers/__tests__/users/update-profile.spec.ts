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
  PhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UpdateProfilePropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UserProfileProps, UserProps } from "@/backend/domain/entities";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserProfileController } from "@/backend/presentation/controllers";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserProfileController;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const dateValidator: DateValidatorUseCase = new DateValidatorStub();
  const emailValidator: EmailValidatorUseCase = new EmailValidatorStub();
  const phoneValidator: PhoneValidatorUseCase = new PhoneValidatorStub();
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const updateProfilePropsValidator = new UpdateProfilePropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  const updateUserProfileService: UpdateUserProfileService =
    new UpdateUserProfileService({
      updateProfilePropsValidator,
      userIdValidator,
      userRepository,
    });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new UpdateUserProfileController({
    updateUserProfileService,
    httpResponsesHelper,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    idValidator,
    httpResponsesHelper,
    phoneValidator,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserProfileController", () => {
  let sut: UpdateUserProfileController;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
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
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 204 if user profile was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponsesHelper.noContent());
  });

  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("id").message
    );
  });

  test("should return 400 if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: "invalid_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("id").message
    );
  });

  test("should return 404 if unregistered id is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      validationErrors.unregisteredError("id").message
    );
  });

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

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("nome").message
    );
  });

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

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("email").message
    );
  });

  test("should return 400 if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "invalid_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.invalidParamError("email").message
    );
  });

  test("should return 400 if already registered email is provided", async () => {
    await userRepository.create(createUserProps());
    await userRepository.create(createUserProps({ email: "another_email" }));
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        // already registered email
        email: "another_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.duplicatedKeyError({ entity: "usuário", key: "email" })
        .message
    );
  });

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

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("telefone").message
    );
  });

  test("should return 400 if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "invalid_phone",
        birthdate: new Date(),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.invalidParamError("telefone").message
    );
  });

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

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("data de nascimento").message
    );
  });

  test("should return 400 if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isBirthdateValid").mockReturnValue(false);
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UserProfileProps> = {
      body: {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date("invalid_birthdate"),
      } as UserProfileProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.invalidParamError("data de nascimento").message
    );
  });
});
