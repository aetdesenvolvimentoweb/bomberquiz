import { UserCreateData } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";
import { InMemoryUserRepository } from "@/backend/infra/repositories";

interface SutResponses {
  sut: UserRepository;
}

const makeSut = (): SutResponses => {
  const sut = new InMemoryUserRepository();
  return {
    sut,
  };
};

describe("UserCreateDataValidator", () => {
  const makeUserCreateData = (): UserCreateData => ({
    name: "any_name",
    email: "any_email@mail.com",
    phone: "(99) 99999-9999",
    birthdate: new Date("2007-01-01T00:00:00.000Z"),
    password: "P@ssw0rd",
  });

  let sut: UserRepository;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  describe("create method", () => {
    const userCreateData = makeUserCreateData();

    it("should create an user", async () => {
      await expect(sut.create(userCreateData)).resolves.not.toThrow();
    });

    it("should store user with all required fields", async () => {
      await sut.create(userCreateData);
      const user = await sut.findByEmail(userCreateData.email);

      expect(user).toMatchObject({
        id: expect.any(String),
        name: userCreateData.name,
        email: userCreateData.email,
        phone: userCreateData.phone,
        birthdate: userCreateData.birthdate,
        password: "hashed_password", // Verifica se a senha foi "hasheada"
        role: expect.any(String),
        avatarUrl: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("findByEmail method", () => {
    const userCreateData = makeUserCreateData();

    it("should return null if user not found", async () => {
      await expect(sut.findByEmail(userCreateData.email)).resolves.toBeNull();
    });

    it("should return an user if user is found", async () => {
      await sut.create(userCreateData);
      const user = await sut.findByEmail(userCreateData.email);
      expect(user).toBeTruthy();
      expect(user?.email).toBe(userCreateData.email);
    });

    it("should find correct user when multiple users exist", async () => {
      const user1 = { ...makeUserCreateData(), email: "user1@example.com" };
      const user2 = { ...makeUserCreateData(), email: "user2@example.com" };

      await sut.create(user1);
      await sut.create(user2);

      const foundUser1 = await sut.findByEmail(user1.email);
      const foundUser2 = await sut.findByEmail(user2.email);

      expect(foundUser1?.email).toBe(user1.email);
      expect(foundUser2?.email).toBe(user2.email);
    });
  });
});
