import { InMemoryUserRepository } from "../inmemory.user.repository";
import { UserCreateData } from "@/backend/domain/entities";

describe("InMemoryUserRepository", () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  const makeValidUserData = (): UserCreateData => ({
    name: "Test User",
    email: "user@test.com",
    phone: "(62) 99999-9999",
    birthdate: new Date("1990-01-01"),
    password: "password12345",
  });

  describe("create", () => {
    it("should create a user successfully", async () => {
      // Arrange
      const userData = makeValidUserData();

      // Act
      await repository.create(userData);

      // Assert - Verified indirectly through findByEmail
      const foundUser = await repository.findByEmail(userData.email);

      expect(foundUser).not.toBeNull();
      expect(foundUser?.name).toBe(userData.name);
      expect(foundUser?.email).toBe(userData.email);
      expect(foundUser?.phone).toBe(userData.phone);
      expect(foundUser?.birthdate).toBe(userData.birthdate);
      expect(foundUser?.password).toBe(userData.password);
    });

    it("should add default fields when creating a user", async () => {
      // Arrange
      const userData = makeValidUserData();

      // Act
      await repository.create(userData);

      // Assert
      const foundUser = await repository.findByEmail(userData.email);

      expect(foundUser).not.toBeNull();
      expect(foundUser?.id).toBeDefined();
      expect(foundUser?.avatarUrl).toBeDefined();
      expect(foundUser?.role).toBeDefined();
      expect(foundUser?.createdAt).toBeInstanceOf(Date);
      expect(foundUser?.updatedAt).toBeInstanceOf(Date);
    });

    it("should generate a unique ID for each user", async () => {
      // Arrange
      const userData1 = makeValidUserData();
      const userData2 = {
        ...makeValidUserData(),
        email: "another@test.com",
      };

      // Act
      await repository.create(userData1);
      await repository.create(userData2);

      // Assert
      const user1 = await repository.findByEmail(userData1.email);
      const user2 = await repository.findByEmail(userData2.email);

      expect(user1?.id).not.toBe(user2?.id);
    });
  });

  describe("findByEmail", () => {
    it("should return the user when the email exists", async () => {
      // Arrange
      const userData = makeValidUserData();
      await repository.create(userData);

      // Act
      const foundUser = await repository.findByEmail(userData.email);

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser?.email).toBe(userData.email);
    });

    it("should return null when the email does not exist", async () => {
      // Arrange
      const nonExistentEmail = "does-not-exist@test.com";

      // Act
      const foundUser = await repository.findByEmail(nonExistentEmail);

      // Assert
      expect(foundUser).toBeNull();
    });

    it("should find the correct user when there are multiple users", async () => {
      // Arrange
      const userData1 = makeValidUserData();
      const userData2 = {
        ...makeValidUserData(),
        email: "another@test.com",
      };
      const userData3 = {
        ...makeValidUserData(),
        email: "third@test.com",
      };

      await repository.create(userData1);
      await repository.create(userData2);
      await repository.create(userData3);

      // Act
      const foundUser = await repository.findByEmail(userData2.email);

      // Assert
      expect(foundUser).not.toBeNull();
      expect(foundUser?.email).toBe(userData2.email);
    });
  });
});
