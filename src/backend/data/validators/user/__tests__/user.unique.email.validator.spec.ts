import { UserUniqueEmailValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

interface SutResponse {
  sut: UserUniqueEmailValidatorUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutResponse => {
  const userRepository = jest.mocked<UserRepository>({
    create: jest.fn(),
    findByEmail: jest.fn(),
  });
  const sut = new UserUniqueEmailValidator(userRepository);

  return {
    sut,
    userRepository,
  };
};

describe("UserUniqueEmailValidator", () => {
  describe("validate", () => {
    it("should call UserRepository with correct email", async () => {
      const { sut, userRepository } = makeSut();
      const email = "any_email@mail.com";
      await sut.validate(email);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    });

    it("should throw if UserRepository returns a user", async () => {
      const { sut, userRepository } = makeSut();
      const email = "any_email@mail.com";
      jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
        id: "any_id",
        name: "any_name",
        email: "any_email@mail.com",
        phone: "any_phone",
        birthdate: new Date(),
        password: "any_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(sut.validate(email)).rejects.toThrow();
    });

    it("should throw if UserRepository returns a user", async () => {
      const { sut, userRepository } = makeSut();
      const email = "any_email@mail.com";
      jest.spyOn(userRepository, "findByEmail").mockResolvedValueOnce({
        id: "any_id",
        name: "any_name",
        email: "any_email@mail.com",
        phone: "any_phone",
        birthdate: new Date(),
        password: "any_password",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(sut.validate(email)).rejects.toThrow();
    });
  });

  describe("edge cases and temporary failures", () => {
    it("should consider emails case-insensitive", async () => {
      const { sut, userRepository } = makeSut();
      const lowerCaseEmail = "test@example.com";
      const upperCaseEmail = "TEST@EXAMPLE.COM";

      // Configura o mock para retornar um usuário quando procurar com email em minúsculas
      jest
        .spyOn(userRepository, "findByEmail")
        .mockImplementation(async (email) => {
          if (email.toLowerCase() === lowerCaseEmail) {
            return {
              id: "any_id",
              name: "any_name",
              email: lowerCaseEmail,
              phone: "any_phone",
              birthdate: new Date(),
              password: "any_password",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        });

      // Deve lançar erro ao validar o mesmo email em maiúsculas
      await expect(sut.validate(upperCaseEmail)).rejects.toThrow();
    });

    it("should handle repository connection failures", async () => {
      const { sut, userRepository } = makeSut();
      const email = "any_email@mail.com";

      // Mock de falha de conexão no repositório
      jest
        .spyOn(userRepository, "findByEmail")
        .mockRejectedValueOnce(new Error("Database connection failed"));

      // O erro do repositório deve ser propagado
      await expect(sut.validate(email)).rejects.toThrow(
        "Database connection failed",
      );
    });

    it("should handle plus sign in email addresses", async () => {
      const { sut, userRepository } = makeSut();
      const baseEmail = "test@example.com";
      const plusEmail = "test+tag@example.com";

      // Configure o mock para retornar um usuário apenas se o email for exatamente o mesmo
      // Não estamos fazendo normalização de emails com "+" aqui
      jest
        .spyOn(userRepository, "findByEmail")
        .mockImplementation(async (email) => {
          if (email === baseEmail) {
            return {
              id: "any_id",
              name: "any_name",
              email: baseEmail,
              phone: "any_phone",
              birthdate: new Date(),
              password: "any_password",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          return null;
        });

      // Não deve lançar erro para um email com "+" mesmo se o base email existir
      await expect(sut.validate(plusEmail)).resolves.not.toThrow();
    });
  });
});
