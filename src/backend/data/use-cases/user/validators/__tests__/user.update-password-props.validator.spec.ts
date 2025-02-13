import { EncrypterStub } from "@/backend/__mocks__";
import { EncrypterUseCase } from "@/backend/domain/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";
import { UserUpdatePasswordPropsValidator } from "@/backend/data/use-cases";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdatePasswordPropsValidator;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de propriedades de atualização de senha
 */
describe("UserUpdatePasswordPropsValidator", () => {
  let sut: UserUpdatePasswordPropsValidator;
  let encrypter: EncrypterUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do validador e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const encrypter = new EncrypterStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const sut = new UserUpdatePasswordPropsValidator({
      encrypter,
      userRepository,
      errorsValidation,
    });

    return {
      sut,
      encrypter,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    encrypter = sutInstance.encrypter;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Cria um usuário para os testes
   */
  const createUser = async () => {
    const hashedPassword = await encrypter.encrypt("valid_password");
    const user = await userRepository.create({
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: hashedPassword,
    });
    return user;
  };

  /**
   * Testa a validação bem-sucedida das propriedades
   */
  test("should validate update password props", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "valid_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de senha atual obrigatória
   */
  test("should throw if no old password is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).rejects.toThrow(errorsValidation.missingParamError("senha atual"));
  });

  /**
   * Testa a validação de formato de senha atual
   */
  test("should throw if invalid old password is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "123",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).rejects.toThrow(errorsValidation.invalidParamError("senha atual"));
  });

  /**
   * Testa a validação de senha atual incorreta
   */
  test("should throw if wrong old password is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    jest.spyOn(encrypter, "verify").mockResolvedValue(false);

    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "wrong_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).rejects.toThrow(errorsValidation.wrongPasswordError("senha atual"));
  });

  /**
   * Testa a validação de nova senha obrigatória
   */
  test("should throw if no new password is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "valid_password",
        newPassword: "",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).rejects.toThrow(errorsValidation.missingParamError("nova senha"));
  });

  /**
   * Testa a validação de formato de nova senha
   */
  test("should throw if invalid new password is provided", async () => {
    await createUser();
    const user = await userRepository.findByEmail("valid_email");
    const updatePasswordData = {
      id: user!.id,
      props: {
        oldPassword: "valid_password",
        newPassword: "123",
      } as UpdateUserPasswordProps,
    };

    await expect(
      sut.validateUpdatePasswordProps(updatePasswordData)
    ).rejects.toThrow(errorsValidation.invalidParamError("nova senha"));
  });
});
