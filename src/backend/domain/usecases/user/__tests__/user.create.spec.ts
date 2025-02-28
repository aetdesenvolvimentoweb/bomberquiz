import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateUseCase } from "../user.create";

// Classe concreta mínima para testar a interface
class TestUserCreateUseCase implements UserCreateUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: UserCreateData): Promise<void> {
    return Promise.resolve();
  }
}

describe("UserCreateUseCase Interface", () => {
  it("should define required methods", () => {
    const useCase = new TestUserCreateUseCase();

    // Verificar se os métodos existem
    expect(typeof useCase.create).toBe("function");
  });

  it("should be able to create a user", async () => {
    const useCase = new TestUserCreateUseCase();
    const createSpy = jest.spyOn(useCase, "create");

    const userData: UserCreateData = {
      name: "Test User",
      email: "test@example.com",
      phone: "(11) 99999-9999",
      birthdate: new Date(),
      password: "password123",
    };

    await useCase.create(userData);

    expect(createSpy).toHaveBeenCalledWith(userData);
  });
});
