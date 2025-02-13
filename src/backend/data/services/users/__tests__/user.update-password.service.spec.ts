import { EncrypterStub, IdValidatorStub } from "@/backend/__mocks__";
import {
  EncrypterUseCase,
  IdValidatorUseCase,
  UserIdValidatorUseCase,
  UserUpdatePasswordPropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UserIdValidator,
  UserUpdatePasswordPropsValidator,
} from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";
import { UserUpdatePasswordService } from "..";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdatePasswordService;
  encrypter: EncrypterUseCase;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do serviço de atualização de senha
 */
describe("UserUpdatePasswordService", () => {
  let sut: UserUpdatePasswordService;
  let encrypter: EncrypterUseCase;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do serviço e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const idValidator = new IdValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();
    const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
      idValidator,
      userRepository,
      errorsValidation,
    });
    const encrypter: EncrypterUseCase = new EncrypterStub();
    const updatePasswordPropsValidator: UserUpdatePasswordPropsValidatorUseCase =
      new UserUpdatePasswordPropsValidator({
        encrypter,
        userRepository,
        errorsValidation,
      });
    const sut = new UserUpdatePasswordService({
      encrypter,
      updatePasswordPropsValidator,
      userRepository,
      userIdValidator,
    });

    return {
      sut,
      encrypter,
      idValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    encrypter = sutInstance.encrypter;
    idValidator = sutInstance.idValidator;
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
   * Testa a atualização bem-sucedida de senha
   */
  test("should update a user password", async () => {
    const hashedPassword = await encrypter.encrypt("any_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        props: {
          oldPassword: "any_password",
          newPassword: "new_password",
        },
      })
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de ID obrigatório
   */
  test("should throw if no id is provided", async () => {
    await expect(
      // @ts-expect-error teste
      sut.updatePassword({
        props: {
          oldPassword: "any_password",
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.missingParamError("id"));
  });

  /**
   * Testa a validação de formato de ID
   */
  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updatePassword({
        id: "invalid-id",
        props: {
          oldPassword: "any_password",
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.invalidParamError("id"));
  });

  /**
   * Testa a validação de ID não registrado
   */
  test("should throw if unregistered id is provided", async () => {
    await expect(
      sut.updatePassword({
        id: "unregistered-id",
        props: {
          oldPassword: "any_password",
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.unregisteredError("id"));
  });

  /**
   * Testa a validação de senha atual obrigatória
   */
  test("should throw if no old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        //@ts-expect-error teste
        props: {
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.missingParamError("senha atual"));
  });

  /**
   * Testa a validação de formato de senha atual
   */
  test("should throw if invalid old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        props: {
          oldPassword: "invalid",
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.invalidParamError("senha atual"));
  });

  /**
   * Testa a validação de senha atual incorreta
   */
  test("should throw if wrong old password is provided", async () => {
    const hashedPassword = await encrypter.encrypt("any_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));
    const user = await userRepository.findByEmail(createUserProps().email);

    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));

    await expect(
      sut.updatePassword({
        id: user!.id,
        props: {
          oldPassword: "wrong_password",
          newPassword: "new_password",
        },
      })
    ).rejects.toThrow(errorsValidation.wrongPasswordError("senha atual"));
  });

  /**
   * Testa a validação de nova senha obrigatória
   */
  test("should throw if no new password is provided", async () => {
    const hashedPassword = await encrypter.encrypt("any_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        //@ts-expect-error teste
        props: {
          oldPassword: "any_password",
        },
      })
    ).rejects.toThrow(errorsValidation.missingParamError("nova senha"));
  });

  /**
   * Testa a validação de formato de nova senha
   */
  test("should throw if invalid new password is provided", async () => {
    const hashedPassword = await encrypter.encrypt("any_password");
    await userRepository.create(createUserProps({ password: hashedPassword }));
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        props: {
          oldPassword: "any_password",
          newPassword: "invalid",
        },
      })
    ).rejects.toThrow(errorsValidation.invalidParamError("nova senha"));
  });
});
