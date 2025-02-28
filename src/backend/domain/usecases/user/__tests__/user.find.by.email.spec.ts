import { User } from "@/backend/domain/entities";
import { UserFindByEmailUseCase } from "../user.find.by.email";

// Classe concreta mínima para testar a interface
class TestUserFindByEmailUseCase implements UserFindByEmailUseCase {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(null);
  }
}

describe("UserFindByEmailUseCase Interface", () => {
  it("should define required methods", () => {
    const useCase = new TestUserFindByEmailUseCase();

    // Verificar se os métodos existem
    expect(typeof useCase.findByEmail).toBe("function");
  });

  it("should be able to find a user by email", async () => {
    const useCase = new TestUserFindByEmailUseCase();
    const findByEmailSpy = jest.spyOn(useCase, "findByEmail");

    const email = "test@example.com";

    await useCase.findByEmail(email);

    expect(findByEmailSpy).toHaveBeenCalledWith(email);
  });
});
