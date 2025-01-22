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
import { CreateUserController } from "@/backend/presentation/controllers";
import { CreateUserService } from "@/backend/data/services";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponses } from "@/backend/presentation/helpers";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: CreateUserController;
  httpResponses: HttpResponses;
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

  return { sut, httpResponses };
};

describe("CreateUserController", () => {
  let sut: CreateUserController;
  let httpResponses: HttpResponses;

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
    httpResponses = sutInstance.httpResponses;
  });

  test("should return 201 if user was created", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    await expect(sut.handle(httpRequest)).resolves.toEqual(
      httpResponses.created()
    );
  });
});
