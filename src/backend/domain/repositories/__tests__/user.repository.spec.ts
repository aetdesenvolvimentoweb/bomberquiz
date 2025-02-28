import { User, UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "../user.repository";

// Classe concreta mínima para testar a interface
class TestUserRepository implements UserRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: UserCreateData): Promise<void> {
    // Implementação mínima apenas para teste da interface
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(null);
  }
}

describe("UserRepository Interface", () => {
  it("should define required methods", () => {
    const repository = new TestUserRepository();

    // Verificar se os métodos existem
    expect(typeof repository.create).toBe("function");
    expect(typeof repository.findByEmail).toBe("function");
  });

  it("should be able to create a user", async () => {
    const repository = new TestUserRepository();
    const createSpy = jest.spyOn(repository, "create");

    const userData: UserCreateData = {
      name: "Test User",
      email: "test@example.com",
      phone: "(11) 99999-9999",
      birthdate: new Date(),
      password: "password123",
    };

    await repository.create(userData);

    expect(createSpy).toHaveBeenCalledWith(userData);
  });

  it("should be able to find a user by email", async () => {
    const repository = new TestUserRepository();
    const findByEmailSpy = jest.spyOn(repository, "findByEmail");

    const email = "test@example.com";

    await repository.findByEmail(email);

    expect(findByEmailSpy).toHaveBeenCalledWith(email);
  });
});
