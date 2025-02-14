import { PrismaUserRepository } from "../user.repository";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { db } from "@/backend/infra/adapters";
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
  const sut = new PrismaUserRepository(db);
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
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    await db.user.deleteMany({});
  });

  /**
   * Testa a criação de usuário
   */
  describe("create", () => {
    test("should be able to create a new user", async () => {
      await expect(sut.create(createUserProps())).resolves.not.toThrow();
    });
  });

  /**
   * Testa a remoção de usuário
   */
  describe("delete", () => {
    test("should be able to delete an user", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await expect(sut.delete(user!.id)).resolves.not.toThrow();
    });
  });

  /**
   * Testa a listagem de usuários
   */
  describe("findAll", () => {
    test("should be able to list all users", async () => {
      await sut.create(createUserProps());

      const users = await sut.findAll();

      expect(users).toHaveLength(1);
      expect(users[0]).toHaveProperty("id");
      expect(users[0].name).toEqual(createUserProps().name);
      expect(users[0].email).toEqual(createUserProps().email);
      expect(users[0].phone).toEqual(createUserProps().phone);
      expect(users[0].birthdate).toEqual(createUserProps().birthdate);
      expect(users[0].role).toEqual(createUserProps().role);
      expect(users[0]).not.toHaveProperty("password");
    });
  });

  /**
   * Testa a busca de usuário por email
   */
  describe("findByEmail", () => {
    test("should be able to list an user by email", async () => {
      await sut.create(createUserProps());

      const user = await sut.findByEmail(createUserProps().email);

      expect(user).toHaveProperty("id");
      expect(user?.name).toEqual(createUserProps().name);
      expect(user?.email).toEqual(createUserProps().email);
      expect(user?.phone).toEqual(createUserProps().phone);
      expect(user?.birthdate).toEqual(createUserProps().birthdate);
      expect(user?.role).toEqual(createUserProps().role);
      expect(user?.password).toEqual(createUserProps().password);
    });
  });

  /**
   * Testa a busca de usuário por ID
   */
  describe("findById", () => {
    test("should be able to list an user by id", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      const userMapped = await sut.findById(user!.id);

      expect(userMapped).toHaveProperty("id");
      expect(userMapped?.name).toEqual(createUserProps().name);
      expect(userMapped?.email).toEqual(createUserProps().email);
      expect(userMapped?.phone).toEqual(createUserProps().phone);
      expect(userMapped?.birthdate).toEqual(createUserProps().birthdate);
      expect(userMapped?.role).toEqual(createUserProps().role);
      expect(userMapped).not.toHaveProperty("password");
    });
  });

  /**
   * Testa a atualização de senha
   */
  describe("updatePassword", () => {
    test("should be able to update an user password", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await expect(
        sut.updatePassword({
          id: user!.id,
          props: {
            oldPassword: "any_password",
            newPassword: "new_password",
          },
        })
      ).resolves.not.toThrow();
    });
  });

  /**
   * Testa a atualização de perfil
   */
  describe("updateProfile", () => {
    test("should be able to update an user profile", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await expect(
        sut.updateProfile({
          id: user!.id,
          props: {
            name: "new_name",
            email: "new_email",
            phone: "new_phone",
            birthdate: new Date(),
          },
        })
      ).resolves.not.toThrow();
    });
  });

  /**
   * Testa a atualização de papel
   */
  describe("updateRole", () => {
    test("should be able to update an user role", async () => {
      await sut.create(createUserProps());
      const user = await sut.findByEmail(createUserProps().email);

      await expect(
        sut.updateRole({
          id: user!.id,
          role: "administrador",
        })
      ).resolves.not.toThrow();
    });
  });
});
