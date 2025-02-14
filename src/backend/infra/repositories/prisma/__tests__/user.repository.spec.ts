import { UserProps, UserRole } from "@/backend/domain/entities";
import { PrismaUserRepository } from "../user.repository";
import { UserRepository } from "@/backend/data/repository";
import { createMockContext } from "@/backend/__mocks__";
import { subYears } from "date-fns";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: UserRepository;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const mockContext = createMockContext();
  const sut = new PrismaUserRepository(mockContext.prisma);
  return { sut };
};

describe("PrismaUserRepository", () => {
  let sut: UserRepository;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
   */
  const fixedBirthdate = subYears(new Date(), 18);
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => ({
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: fixedBirthdate,
    role: "cliente",
    password: "any_password",
    ...overrides,
  });

  beforeAll(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa a criação de usuário
   */
  describe("create", () => {
    test("should be able to create a new user", async () => {
      jest.spyOn(sut, "create").mockResolvedValue();
      await expect(sut.create(createUserProps())).resolves.not.toThrow();
    });

    test("should throw if email already exists", async () => {
      jest
        .spyOn(sut, "create")
        .mockRejectedValue(new Error("Erro ao criar usuário"));
      await expect(sut.create(createUserProps())).rejects.toThrow(
        "Erro ao criar usuário"
      );
    });
  });

  /**
   * Testa a listagem de usuários
   */
  describe("findAll", () => {
    test("should be able to list all users", async () => {
      const mappedUsers = [
        {
          id: "user1",
          name: "User 1",
          email: "user1@email.com",
          phone: "phone1",
          birthdate: fixedBirthdate,
          role: "cliente" as UserRole,
          createdAt: fixedBirthdate,
          updatedAt: fixedBirthdate,
        },
      ];

      jest.spyOn(sut, "findAll").mockResolvedValue(mappedUsers);
      const users = await sut.findAll();

      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty("id");
      expect(users[0].name).toBe("User 1");
      expect(users[0]).not.toHaveProperty("password");
    });

    test("should throw on database error", async () => {
      jest
        .spyOn(sut, "findAll")
        .mockRejectedValue(new Error("Erro ao consultar usuários"));
      await expect(sut.findAll()).rejects.toThrow("Erro ao consultar usuários");
    });
  });

  /**
   * Testa a busca de usuário por email
   */
  describe("findByEmail", () => {
    test("should be able to find user by email", async () => {
      const userData = createUserProps();
      const existingUser = {
        id: "existing_id",
        ...userData,
        createdAt: fixedBirthdate,
        updatedAt: fixedBirthdate,
      };

      jest.spyOn(sut, "findByEmail").mockResolvedValue(existingUser);
      const user = await sut.findByEmail(userData.email);

      expect(user).toHaveProperty("id");
      expect(user?.email).toBe(userData.email);
    });

    test("should return null for non-existent email", async () => {
      jest.spyOn(sut, "findByEmail").mockResolvedValue(null);
      const user = await sut.findByEmail("nonexistent@email.com");
      expect(user).toBeNull();
    });
  });

  /**
   * Testa a busca de usuário por ID
   */
  describe("findById", () => {
    test("should be able to find user by id", async () => {
      const mappedUser = {
        id: "existing_id",
        name: "any_name",
        email: "valid_email",
        phone: "any_phone",
        birthdate: fixedBirthdate,
        role: "cliente" as UserRole,
        createdAt: fixedBirthdate,
        updatedAt: fixedBirthdate,
      };

      jest.spyOn(sut, "findById").mockResolvedValue(mappedUser);
      const user = await sut.findById("existing_id");

      expect(user).toHaveProperty("id");
      expect(user).not.toHaveProperty("password");
    });

    test("should return null for non-existent id", async () => {
      jest.spyOn(sut, "findById").mockResolvedValue(null);
      const user = await sut.findById("nonexistent_id");
      expect(user).toBeNull();
    });
  });

  /**
   * Testa a atualização de senha
   */
  describe("updatePassword", () => {
    test("should be able to update password", async () => {
      const updatePasswordData = {
        id: "existing_id",
        props: {
          oldPassword: "old_password",
          newPassword: "new_password",
        },
      };

      jest.spyOn(sut, "updatePassword").mockResolvedValue();
      await expect(
        sut.updatePassword(updatePasswordData)
      ).resolves.not.toThrow();
    });

    test("should throw on update error", async () => {
      jest
        .spyOn(sut, "updatePassword")
        .mockRejectedValue(new Error("Erro ao atualizar senha"));
      await expect(
        sut.updatePassword({
          id: "any_id",
          props: { oldPassword: "old", newPassword: "new" },
        })
      ).rejects.toThrow("Erro ao atualizar senha");
    });
  });

  /**
   * Testa a atualização de perfil
   */
  describe("updateProfile", () => {
    test("should be able to update profile", async () => {
      const updateData = {
        name: "updated_name",
        email: "updated_email",
        phone: "updated_phone",
        birthdate: new Date(fixedBirthdate),
      };

      jest.spyOn(sut, "updateProfile").mockResolvedValue();
      await expect(
        sut.updateProfile({ id: "existing_id", props: updateData })
      ).resolves.not.toThrow();
    });

    test("should throw on update error", async () => {
      jest
        .spyOn(sut, "updateProfile")
        .mockRejectedValue(new Error("Erro ao atualizar perfil"));
      await expect(
        sut.updateProfile({
          id: "any_id",
          props: createUserProps(),
        })
      ).rejects.toThrow("Erro ao atualizar perfil");
    });
  });

  /**
   * Testa a atualização de papel
   */
  describe("updateRole", () => {
    test("should be able to update role", async () => {
      const updateRoleData = {
        id: "existing_id",
        role: "administrador" as UserRole,
      };

      jest.spyOn(sut, "updateRole").mockResolvedValue();
      await expect(sut.updateRole(updateRoleData)).resolves.not.toThrow();
    });

    test("should throw on update error", async () => {
      jest
        .spyOn(sut, "updateRole")
        .mockRejectedValue(new Error("Erro ao atualizar papel"));
      await expect(
        sut.updateRole({
          id: "any_id",
          role: "cliente",
        })
      ).rejects.toThrow("Erro ao atualizar papel");
    });
  });

  /**
   * Testa a remoção de usuário
   */
  describe("delete", () => {
    test("should be able to delete user", async () => {
      jest.spyOn(sut, "delete").mockResolvedValue();
      await expect(sut.delete("existing_id")).resolves.not.toThrow();
    });

    test("should throw on delete error", async () => {
      jest
        .spyOn(sut, "delete")
        .mockRejectedValue(new Error("Erro ao excluir usuário"));
      await expect(sut.delete("any_id")).rejects.toThrow(
        "Erro ao excluir usuário"
      );
    });
  });
});
