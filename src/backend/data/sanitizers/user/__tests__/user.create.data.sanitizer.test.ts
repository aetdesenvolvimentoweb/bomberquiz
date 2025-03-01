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
import { UserCreateDataValidator } from "@/backend/data/validators/user/user.create.data.validator";
import { UserCreateService } from "@/backend/data/services/user/user.create.service";
import { UserPasswordValidator } from "@/backend/data/validators/user/user.password.validator";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidator } from "@/backend/data/validators/user/user.unique.email.validator";

interface SutResponses {
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  userCreateService: UserCreateService;
  userRepository: UserRepository;
  loggerProvider: LoggerProviderMock;
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
    const userRepository = new InMemoryUserRepository();
    const userCreateDataSanitizer = new UserCreateDataSanitizer();
    const hashProvider = new HashProviderMock();
    const loggerProvider = new LoggerProviderMock();

    // Validadores
    const userBirthdateValidator = new UserBirthdateValidatorMock();
    const userEmailValidator = new UserEmailValidatorMock();
    const userPasswordValidator = new UserPasswordValidator();
    const userPhoneValidator = new UserPhoneValidatorMock();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(
      userRepository,
    );

    // Validador composto
    const userCreateDataValidator = new UserCreateDataValidator({
      userBirthdateValidator,
      userEmailValidator,
      userPasswordValidator,
      userPhoneValidator,
      userUniqueEmailValidator,
    });

    // Serviço que usa o sanitizador
    const userCreateService = new UserCreateService({
      userRepository,
      hashProvider,
      loggerProvider,
      userCreateDataSanitizer,
      userCreateDataValidator,
    });

    return {
      userCreateDataSanitizer,
      userCreateService,
      userRepository,
      loggerProvider,
    };
  };

  describe("Integration with UserCreateService", () => {
    it("should sanitize data before saving to repository", async () => {
      const { userCreateDataSanitizer, userCreateService, userRepository } =
        makeSut();
      const sanitizeSpy = jest.spyOn(userCreateDataSanitizer, "sanitize");

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
      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("John Doe"); // Sem espaços extras
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas
    });

    it("should sanitize data with extreme values", async () => {
      const { userCreateService, userRepository } = makeSut();

      const userData: UserCreateData = {
        name: "   JOHN   DOE   ", // Múltiplos espaços
        email: "   JOHN.DOE@EXAMPLE.COM   ", // Espaços e maiúsculas
        phone: "   (11) 99999-9999   ", // Espaços no telefone
        birthdate: new Date("1990-01-01"),
        password: "   Password123!   ", // Espaços na senha
      };

      await userCreateService.create(userData);

      // Verifica se os dados sanitizados foram salvos no repositório
      const createdUser = await userRepository.findByEmail(
        "john.doe@example.com",
      );
      expect(createdUser).not.toBeNull();
      expect(createdUser?.name).toBe("JOHN   DOE"); // Mantém maiúsculas e espaços internos
      expect(createdUser?.email).toBe("john.doe@example.com"); // Em minúsculas, sem espaços
      expect(createdUser?.phone).toBe("11999999999"); // Remove caracteres não numéricos
    });
  });

  describe("Sanitizer behavior", () => {
    it("should sanitize data with special characters", async () => {
      const { userCreateDataSanitizer } = makeSut();

      const userData: UserCreateData = {
        name: "<script>alert('XSS')</script> John Doe", // Tentativa de XSS
        email: "john.doe+test@example.com", // Email com caracteres especiais
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "Password123!",
      };

      const sanitizedData = userCreateDataSanitizer.sanitize(userData);

      // Verifica se os dados foram sanitizados corretamente
      expect(sanitizedData.name).toBe("<script>alert('XSS')</script> John Doe"); // O sanitizador atual não remove scripts
      expect(sanitizedData.email).toBe("john.doe+test@example.com"); // Mantém o + no email
    });

    it("should keep birthdate unchanged", async () => {
      const { userCreateDataSanitizer } = makeSut();
      const birthdate = new Date("1990-01-01");

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate,
        password: "Password123!",
      };

      const sanitizedData = userCreateDataSanitizer.sanitize(userData);

      // Verifica se a data de nascimento não foi alterada
      expect(sanitizedData.birthdate).toBe(birthdate);
    });

    it("should keep password unchanged", async () => {
      const { userCreateDataSanitizer } = makeSut();
      const password = "Password123!";

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password,
      };

      const sanitizedData = userCreateDataSanitizer.sanitize(userData);

      // Verifica se a senha não foi alterada
      expect(sanitizedData.password).toBe(password);
    });
  });
});
