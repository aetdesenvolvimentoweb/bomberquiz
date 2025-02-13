import {
  UpdateUserPasswordProps,
  UserMapped,
  UserProps,
} from "@/backend/domain/entities";
import { UserRepositoryInMemory } from "../user.repository";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: UserRepositoryInMemory;
}

/**
 * Cria uma instância do sistema em teste
 * @returns Objeto contendo o sistema em teste
 */
const makeSut = (): SutTypes => {
  const sut = new UserRepositoryInMemory();
  return { sut };
};

describe("UserRepositoryInMemory", () => {
  let sut: UserRepositoryInMemory;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
   */
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => {
    return {
      name: "any_name",
      email: "any_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
      ...overrides,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  /**
   * Testa a criação de usuário
   */
  describe("create", () => {
    test("should create user with correct values", async () => {
      const userProps = createUserProps();
      await sut.create(userProps);

      const user = await sut.findByEmail(userProps.email);

      expect(user).toBeTruthy();
      expect(user?.id).toBeTruthy();
      expect(user?.name).toBe(userProps.name);
      expect(user?.email).toBe(userProps.email);
      expect(user?.phone).toBe(userProps.phone);
      expect(user?.birthdate).toBe(userProps.birthdate);
      expect(user?.role).toBe(userProps.role);
      expect(user?.password).toBe(userProps.password);
      expect(user?.createdAt).toBeInstanceOf(Date);
      expect(user?.updatedAt).toBeInstanceOf(Date);
    });
  });

  /**
   * Testa a remoção de usuário
   */
  describe("delete", () => {
    test("should delete user by id", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await sut.delete(user!.id);
      const deletedUser = await sut.findById(user!.id);

      expect(deletedUser).toBeNull();
    });
  });

  /**
   * Testa a listagem de usuários
   */
  describe("findAll", () => {
    test("should return empty array if no users exist", async () => {
      const users = await sut.findAll();
      expect(users).toEqual([]);
    });

    test("should return all users without password", async () => {
      await sut.create(createUserProps());
      await sut.create(createUserProps({ email: "other_email" }));

      const users: UserMapped[] = await sut.findAll();

      expect(users).toHaveLength(2);
      expect(users[0]).not.toHaveProperty("password");
      expect(users[1]).not.toHaveProperty("password");
    });
  });

  /**
   * Testa a busca de usuário por email
   */
  describe("findByEmail", () => {
    test("should return null if user not found", async () => {
      const user = await sut.findByEmail("any_email");
      expect(user).toBeNull();
    });

    test("should return user if found", async () => {
      const userProps = createUserProps();
      await sut.create(userProps);

      const user = await sut.findByEmail(userProps.email);

      expect(user).toBeTruthy();
      expect(user?.email).toBe(userProps.email);
    });
  });

  /**
   * Testa a busca de usuário por ID
   */
  describe("findById", () => {
    test("should return null if user not found", async () => {
      const user = await sut.findById("any_id");
      expect(user).toBeNull();
    });

    test("should return user without password if found", async () => {
      await sut.create(createUserProps());
      const createdUser = await sut.findByEmail(createUserProps().email);

      const user = await sut.findById(createdUser!.id);

      expect(user).toBeTruthy();
      expect(user?.id).toBe(createdUser!.id);
      expect(user).not.toHaveProperty("password");
    });
  });

  /**
   * Testa a atualização de senha
   */
  describe("updatePassword", () => {
    test("should update user password", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await sut.updatePassword({
        id: user!.id,
        props: { newPassword: "new_password" } as UpdateUserPasswordProps,
      });

      const updatedUser = await sut.findByEmail(createUserProps().email);
      expect(updatedUser?.password).toBe("new_password");
    });
  });

  /**
   * Testa a atualização de perfil
   */
  describe("updateProfile", () => {
    test("should update user profile", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      const newProfile = {
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      };

      await sut.updateProfile({
        id: user!.id,
        props: newProfile,
      });

      const updatedUser = await sut.findByEmail(newProfile.email);
      expect(updatedUser?.name).toBe(newProfile.name);
      expect(updatedUser?.email).toBe(newProfile.email);
      expect(updatedUser?.phone).toBe(newProfile.phone);
      expect(updatedUser?.birthdate).toBe(newProfile.birthdate);
    });
  });

  /**
   * Testa a atualização de papel
   */
  describe("updateRole", () => {
    test("should update user role", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await sut.updateRole({
        id: user!.id,
        role: "administrador",
      });

      const updatedUser = await sut.findByEmail(createUserProps().email);
      expect(updatedUser?.role).toBe("administrador");
    });
  });
});
