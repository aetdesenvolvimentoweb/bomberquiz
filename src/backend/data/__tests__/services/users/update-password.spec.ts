/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/validators";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserPasswordService;
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
  const sut = new UpdateUserPasswordService({
    userRepository,
    userIdValidator,
  });

  return {
    sut,
    idValidator,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserPasswordService", () => {
  let sut: UpdateUserPasswordService;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should update a user password", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.listByEmail(createUserProps.email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "any_password",
        newPassword: "new_password",
      })
    ).resolves.not.toThrow();
  });
});
