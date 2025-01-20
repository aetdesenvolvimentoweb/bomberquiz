import { EncrypterStub, IdValidatorStub } from "@/backend/data/__mocks__";
import {
  EncrypterUseCase,
  IdValidatorUseCase,
  UpdatePasswordPropsValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserPasswordProps, UserProps } from "@/backend/domain/entities";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserPasswordService;
  encrypter: EncrypterUseCase;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const updatePasswordPropsValidator: UpdatePasswordPropsValidatorUseCase =
    new UpdatePasswordPropsValidator({
      encrypter,
      userRepository,
      validationErrors,
    });
  const sut = new UpdateUserPasswordService({
    updatePasswordPropsValidator,
    userRepository,
    userIdValidator,
  });

  return {
    sut,
    encrypter,
    idValidator,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserPasswordService", () => {
  let sut: UpdateUserPasswordService;
  let encrypter: EncrypterUseCase;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    encrypter = sutInstance.encrypter;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

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

  test("should update a user password", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "any_password",
        newPassword: "new_password",
      })
    ).resolves.not.toThrow();
  });

  test("should throw if no id is provided", async () => {
    await expect(
      sut.updatePassword({
        oldPassword: "any_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps)
    ).rejects.toThrow(validationErrors.missingParamError("id"));
  });

  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updatePassword({
        id: "invalid-id",
        oldPassword: "any_password",
        newPassword: "new_password",
      })
    ).rejects.toThrow(validationErrors.invalidParamError("id"));
  });

  test("should throw if unregistered id is provided", async () => {
    await expect(
      sut.updatePassword({
        id: "unregistered-id",
        oldPassword: "any_password",
        newPassword: "new_password",
      })
    ).rejects.toThrow(validationErrors.unregisteredError("id"));
  });

  test("should throw if no old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        newPassword: "new_password",
      } as UpdateUserPasswordProps)
    ).rejects.toThrow(validationErrors.missingParamError("senha atual"));
  });

  test("should throw if invalid old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "invalid",
        newPassword: "new_password",
      } as UpdateUserPasswordProps)
    ).rejects.toThrow(validationErrors.invalidParamError("senha atual"));
  });

  test("should throw if wrong old password is provided", async () => {
    const hashedPassword = await encrypter.encrypt("any_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));
    const user = await userRepository.listByEmail(createUserProps().email);

    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "wrong_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps)
    ).rejects.toThrow(validationErrors.wrongPasswordError("senha atual"));
  });

  test("should throw if no new password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "any_password",
      } as UpdateUserPasswordProps)
    ).rejects.toThrow(validationErrors.missingParamError("nova senha"));
  });
});
