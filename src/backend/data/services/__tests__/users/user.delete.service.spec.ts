import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { IdValidatorStub } from "@/backend/__mocks__";
import { UserDeleteService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserDeleteService;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do serviço de remoção de usuário
 */
describe("UserDeleteService", () => {
  let sut: UserDeleteService;
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
    const sut = new UserDeleteService({
      userRepository,
      userIdValidator,
    });

    return {
      sut,
      idValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Propriedades padrão de usuário para os testes
   */
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  /**
   * Testa a remoção bem-sucedida de usuário
   */
  test("should delete a user", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.findByEmail(createUserProps.email);

    await expect(sut.delete(user!.id)).resolves.not.toThrow();
  });

  /**
   * Testa a validação de ID obrigatório
   */
  test("should throw if no id is provided", async () => {
    await expect(sut.delete("")).rejects.toThrow(
      errorsValidation.missingParamError("id")
    );
  });

  /**
   * Testa a validação de formato de ID
   */
  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(sut.delete("invalid-id")).rejects.toThrow(
      errorsValidation.invalidParamError("id")
    );
  });

  /**
   * Testa a validação de ID não registrado
   */
  test("should throw if unregistered id is provided", async () => {
    await expect(sut.delete("valid-id")).rejects.toThrow(
      errorsValidation.unregisteredError("id")
    );
  });
});
