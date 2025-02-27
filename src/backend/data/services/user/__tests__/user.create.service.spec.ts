import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import {
  UserCreateValidator,
  UserPasswordValidator,
} from "@/backend/data/validators";
import { InMemoryUserRepository } from "@/backend/infra/repositories";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateService } from "../user.create.service";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

interface SutResponses {
  sut: UserCreateUseCase;
}

const makeSut = (): SutResponses => {
  const repository: UserRepository = new InMemoryUserRepository();
  const sanitizer: UserCreateDataSanitizerUseCase =
    new UserCreateDataSanitizer();
  const userPasswordValidator = new UserPasswordValidator();
  const validator: UserCreateValidatorUseCase = new UserCreateValidator({
    userPasswordValidator,
  });
  const sut = new UserCreateService({
    repository,
    sanitizer,
    validator,
  });

  return { sut };
};

describe("UserCreateService", () => {
  const makeValidUserData = (): UserCreateData => ({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "123456789",
    birthdate: new Date(),
    password: "password123",
  });

  it("should create a user", async () => {
    const { sut } = makeSut();
    const data = makeValidUserData();
    await expect(sut.create(data)).resolves.not.toThrow();
  });

  describe("Validate required fields", () => {
    // Mapa de campos para labels
    const fieldToLabelMap: Record<string, string> = {
      name: "nome",
      email: "email",
      phone: "telefone",
      birthdate: "data de nascimento",
      password: "senha",
    };

    // Função genérica para omitir um campo
    const omitField = (field: string, data: UserCreateData) => {
      return Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== field),
      ) as UserCreateData;
    };

    // Cria os casos de teste a partir do mapa
    const testCases = Object.entries(fieldToLabelMap).map(([field, label]) => ({
      field,
      label,
    }));

    test.each(testCases)(
      "should throw a MissingParamError if $field is not provided",
      async ({ field, label }) => {
        const { sut } = makeSut();
        const validData = makeValidUserData();
        const invalidData = omitField(field, validData);

        await expect(sut.create(invalidData)).rejects.toThrow(
          new MissingParamError(label),
        );
      },
    );

    it("should throw a InvalidParamError if password is less than 8 characters", async () => {
      const { sut } = makeSut();
      const validData = makeValidUserData();
      validData.password = "1234567";

      await expect(sut.create(validData)).rejects.toThrow(
        new InvalidParamError("senha deve ter no mínimo 8 caracteres."),
      );
    });
  });
});
