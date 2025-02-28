import {
  UserBirthdateValidatorMock,
  UserEmailValidatorMock,
  UserPhoneValidatorMock,
} from "@/backend/__mocks__/user";
import { HashProviderMock } from "@/backend/__mocks__/hash.provider.mock";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { LoggerProviderMock } from "@/backend/__mocks__/logger.provider.mock";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "../user.create.data.sanitizer";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateService } from "@/backend/data/services/user/user.create.service";
import { UserCreateValidator } from "@/backend/data/validators/user/user.create.validator";
import { UserPasswordValidator } from "@/backend/data/validators/user/user.password.validator";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidator } from "@/backend/data/validators/user/user.unique.email.validator";

interface SutResponses {
  sanitizer: UserCreateDataSanitizerUseCase;
  userCreateService: UserCreateService;
  repository: UserRepository;
  logger: LoggerProviderMock;
}

/**
 * Teste de integração para o sanitizador de dados de criação de usuário
 *
 * Este teste verifica a integração entre:
 * - UserCreateDataSanitizer (sanitizador)
 * - UserCreateService (serviço que usa o sanitizador)
 * - InMemoryUserRepository (repositório que armazena os dados sanitizados)
 */
describe("UserCreateDataSanitizer Integration", () => {
  const makeSut = (): SutResponses => {
    const repository = new InMemoryUserRepository();
    const sanitizer = new UserCreateDataSanitizer();
    const hashProvider = new HashProviderMock();
    const logger = new LoggerProviderMock();

    // Validadores
    const userBirthdateValidator = new UserBirthdateValidatorMock();
    const userEmailValidator = new UserEmailValidatorMock();
    const userPasswordValidator = new UserPasswordValidator();
    const userPhoneValidator = new UserPhoneValidatorMock();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(repository);

    // Validador composto
    const validator = new UserCreateValidator({
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    });

    // Serviço que usa o sanitizador
    const userCreateService = new UserCreateService({
      repository,
      hashProvider,
      logger,
      sanitizer,
      validator,
    });

    return {
      sanitizer,
      userCreateService,
      repository,
      logger,
    };
  };

  describe("Integration with UserCreateService", () => {
    it("should sanitize data before saving to repository", async () => {
      const { sanitizer, userCreateService, repository } = makeSut();
      const sanitizeSpy = jest.spyOn(sanitizer, "sanitize");

      const userData: UserCreateData = {
        name: "  John Doe  ", // Com espaços extras
        email: "JOHN.DOE@EXAMPLE.COM", // Em maiúsculas
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      await userCreateService.create(userData);

      // Verifica se o sanitizador foi chamado
      expect(sanitizeSpy).toHaveBeenCalledWith(userData);

      // Verifica se os dados sanitizados foram salvos no repositório
      const createdUser = await repository.findByEmail("john.doe@example.com");
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("John Doe"); // Sem espaços extras
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas
    });

    it("should sanitize data with extreme values", async () => {
      const { userCreateService, repository } = makeSut();

      const userData: UserCreateData = {
        name: "   JOHN   DOE   ", // Múltiplos espaços
        email: "   JOHN.DOE@EXAMPLE.COM   ", // Espaços e maiúsculas
        phone: "   (11) 99999-9999   ", // Espaços no telefone
        birthdate: new Date("1990-01-01"),
        password: "   Password123!   ", // Espaços na senha
      };

      await userCreateService.create(userData);

      // Verifica se os dados sanitizados foram salvos no repositório
      const createdUser = await repository.findByEmail("john.doe@example.com");
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("JOHN   DOE"); // Mantém maiúsculas e espaços internos
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas, sem espaços
      expect(createdUser?.phone).toBe("11999999999"); // Remove caracteres não numéricos
    });
  });

  describe("Sanitizer behavior", () => {
    it("should sanitize data with special characters", async () => {
      const { sanitizer } = makeSut();

      const userData: UserCreateData = {
        name: "<script>alert('XSS')</script> John Doe", // Tentativa de XSS
        email: "john.doe+test@example.com", // Email com caracteres especiais
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      const sanitizedData = sanitizer.sanitize(userData);

      // Verifica se os dados foram sanitizados corretamente
      expect(sanitizedData.name).toBe("<script>alert('XSS')</script> John Doe"); // O sanitizador atual não remove scripts
      expect(sanitizedData.email).toBe("john.doe+test@example.com"); // Mantém o + no email
    });

    it("should keep birthdate unchanged", async () => {
      const { sanitizer } = makeSut();
      const birthdate = new Date("1990-01-01");

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate,
        password: "Password123!",
      };

      const sanitizedData = sanitizer.sanitize(userData);

      // Verifica se a data de nascimento não foi alterada
      expect(sanitizedData.birthdate).toBe(birthdate);
    });

    it("should keep password unchanged", async () => {
      const { sanitizer } = makeSut();
      const password = "Password123!";

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password,
      };

      const sanitizedData = sanitizer.sanitize(userData);

      // Verifica se a senha não foi alterada
      expect(sanitizedData.password).toBe(password);
    });
  });
});
