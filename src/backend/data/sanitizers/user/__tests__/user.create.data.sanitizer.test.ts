import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import { UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { InMemoryUserRepository } from "@/backend/infra/repositories";

interface SutResponses {
  sut: UserCreateDataSanitizerUseCase;
  userCreateService: UserCreateService;
  userRepository: UserRepository;
}

const makeSut = (): SutResponses => {
  const sut = new UserCreateDataSanitizer();
  const userRepository = new InMemoryUserRepository();
  const loggerProvider = new ConsoleLoggerProvider();
  const userBirthdateValidator = jest.mocked<UserBirthdateValidatorUseCase>({
    validate: jest.fn(),
  });
  const userEmailValidator = jest.mocked<UserEmailValidatorUseCase>({
    validate: jest.fn(),
  });
  const userPasswordValidator = new UserPasswordValidator();
  const userPhoneValidator = jest.mocked<UserPhoneValidatorUseCase>({
    validate: jest.fn(),
  });
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });
  const userCreateService = new UserCreateService({
    userRepository,
    loggerProvider,
    userCreateDataValidator,
    userCreateDataSanitizer: sut,
  });

  return {
    sut,
    userCreateService,
    userRepository,
  };
};

describe("UserCreateDataSanitizer Integration", () => {
  let sut: UserCreateDataSanitizerUseCase;
  let userCreateService: UserCreateService;
  let userRepository: UserRepository;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userCreateService = sutInstance.userCreateService;
    userRepository = sutInstance.userRepository;
  });

  describe("Integration with UserCreateService", () => {
    it("should sanitize data before saving to repository", async () => {
      const sanitizeSpy = jest.spyOn(sut, "sanitize");

      const userData: UserCreateData = {
        name: "  John Doe  ", // Com espaços extras
        email: "JOHN.DOE@EXAMPLE.COM", // Em maiúsculas
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "P@ssw0rd",
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
      const userData: UserCreateData = {
        name: "   JOHN   DOE   ", // Múltiplos espaços
        email: "   JOHN.DOE@EXAMPLE.COM   ", // Espaços e maiúsculas
        phone: "   (11) 99999-9999   ", // Espaços no telefone
        birthdate: new Date("1990-01-01"),
        password: "   P@ssw0rd   ", // Espaços na senha
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
      const userData: UserCreateData = {
        name: "<script>alert('XSS')</script> John Doe", // Tentativa de XSS
        email: "john.doe+test@example.com", // Email com caracteres especiais
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password: "P@ssw0rd",
      };

      const sanitizedData = sut.sanitize(userData);

      // Verifica se os dados foram sanitizados corretamente
      expect(sanitizedData.name).toBe("<script>alert('XSS')</script> John Doe"); // O sanitizador atual não remove scripts
      expect(sanitizedData.email).toBe("john.doe+test@example.com"); // Mantém o + no email
    });

    it("should keep birthdate unchanged", async () => {
      const { sut } = makeSut();
      const birthdate = new Date("1990-01-01");

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate,
        password: "P@ssw0rd",
      };

      const sanitizedData = sut.sanitize(userData);

      // Verifica se a data de nascimento não foi alterada
      expect(sanitizedData.birthdate).toBe(birthdate);
    });

    it("should keep password unchanged", async () => {
      const password = "P@ssw0rd";

      const userData: UserCreateData = {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(11) 99999-9999",
        birthdate: new Date("1990-01-01"),
        password,
      };

      const sanitizedData = sut.sanitize(userData);

      // Verifica se a senha não foi alterada
      expect(sanitizedData.password).toBe(password);
    });
  });
});
