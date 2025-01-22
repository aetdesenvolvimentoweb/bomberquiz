/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import {
  EncrypterUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged, UserProps } from "@/backend/domain/entities";
import { EncrypterStub } from "@/backend/data/__mocks__";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/data/repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: LoginService;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub();
  const userRepository = new UserRepositoryInMemory();
  const authRepository = new AuthRepositoryInMemory(userRepository);
  const validationErrors = new ValidationErrors();
  const loginValidator: LoginValidatorUseCase = new LoginValidator({
    authRepository,
    validationErrors,
  });
  const sut = new LoginService({
    authRepository,
    loginValidator,
  });

  return {
    sut,
    encrypter,
    userRepository,
    validationErrors,
  };
};

describe("LoginService", () => {
  let sut: LoginService;
  let encrypter: EncrypterUseCase;
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

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    encrypter = sutInstance.encrypter;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should login", async () => {
    const hashedPassword = await encrypter.encrypt("correct_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({
        email: "valid_email",
        password: "correct_password",
      } as LoginProps)
    ).resolves.not.toThrow();
  });

  test("should return user logged", async () => {
    const hashedPassword = await encrypter.encrypt("correct_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));

    const userLogged: UserLogged | null = await sut.login({
      email: "valid_email",
      password: "correct_password",
    } as LoginProps);

    expect(userLogged).not.toBeNull();
    expect(userLogged).toHaveProperty("id");
    expect(userLogged?.email).toEqual("valid_email");
    expect(userLogged?.name).toEqual(createUserProps().name);
    expect(userLogged?.role).toEqual(createUserProps().role);
    expect(userLogged).not.toHaveProperty("password");
  });
});
