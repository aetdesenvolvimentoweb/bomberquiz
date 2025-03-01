import { DuplicateResourceError } from "@/backend/domain/errors";
import { InMemoryUserRepository } from "@/backend/infra/repositories/inmemory.user.repository";
import { UserCreateData } from "@/backend/domain/entities";
import { UserUniqueEmailValidator } from "../user.unique.email.validator";

/**
 * Teste de integração para o validador de email único
 *
 * Este teste verifica a integração entre:
 * - UserUniqueEmailValidator (validador)
 * - InMemoryUserRepository (repositório)
 */
describe("UserUniqueEmailValidator Integration", () => {
  const makeSut = () => {
    const userRepository = new InMemoryUserRepository();
    const userUniqueEmailValidator = new UserUniqueEmailValidator(
      userRepository,
    );

    return {
      userUniqueEmailValidator,
      userRepository,
    };
  };

  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(11) 99999-9999",
    birthdate: new Date("1990-01-01"),
    password: "Password123!",
  });

  it("deve validar um email que não existe no repositório", async () => {
    const { userUniqueEmailValidator } = makeSut();

    await expect(
      userUniqueEmailValidator.validate({ email: "new.user@example.com" }),
    ).resolves.not.toThrow();
  });

  it("deve lançar DuplicateResourceError quando o email já existe no repositório", async () => {
    const { userUniqueEmailValidator, userRepository } = makeSut();
    const userData = makeValidUserData();

    // Criar um usuário com o email
    await userRepository.create(userData);

    await expect(
      userUniqueEmailValidator.validate({ email: userData.email }),
    ).rejects.toThrow(DuplicateResourceError);
    await expect(
      userUniqueEmailValidator.validate({ email: userData.email }),
    ).rejects.toThrow("Email já cadastrado no sistema");
  });

  it("deve ser case-insensitive na verificação de email", async () => {
    const { userUniqueEmailValidator, userRepository } = makeSut();
    const userData = makeValidUserData();

    // Criar um usuário com o email em minúsculas
    await userRepository.create(userData);

    // Verificar com o mesmo email em maiúsculas
    await expect(
      userUniqueEmailValidator.validate({
        email: userData.email.toUpperCase(),
      }),
    ).rejects.toThrow(DuplicateResourceError);
  });

  it("deve ignorar espaços extras na verificação de email", async () => {
    const { userUniqueEmailValidator, userRepository } = makeSut();
    const userData = makeValidUserData();

    // Criar um usuário com o email
    await userRepository.create(userData);

    // Verificar com o mesmo email com espaços extras
    await expect(
      userUniqueEmailValidator.validate({ email: ` ${userData.email} ` }),
    ).rejects.toThrow(DuplicateResourceError);
  });
});
