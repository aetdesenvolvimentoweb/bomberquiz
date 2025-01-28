import { PrismaUserRepositoryAdapter } from "../user";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { db } from "../../prisma-client";

interface SutTypes {
  sut: UserRepository;
}

const makeSut = (): SutTypes => {
  const sut = new PrismaUserRepositoryAdapter();

  return { sut };
};

describe("PrismaUserRepositoryAdapter", () => {
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  const sutInstance = makeSut();
  const sut = sutInstance.sut;

  beforeAll(async () => {
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    await db.user.deleteMany({});
  });

  test("should be able to create a new user", async () => {
    await expect(sut.create(createUserProps)).resolves.not.toThrow();
  });

  test("should be able to delete an user", async () => {
    await sut.create(createUserProps);
    const user = await sut.listByEmail(createUserProps.email);

    await expect(sut.delete(user!.id)).resolves.not.toThrow();
  });

  test("should be able to list all users", async () => {
    await sut.create(createUserProps);

    const users = await sut.listAll();

    expect(users).toHaveLength(1);
    expect(users[0]).toHaveProperty("id");
    expect(users[0].name).toEqual(createUserProps.name);
    expect(users[0].email).toEqual(createUserProps.email);
    expect(users[0].phone).toEqual(createUserProps.phone);
    expect(users[0].birthdate).toEqual(createUserProps.birthdate);
    expect(users[0].role).toEqual(createUserProps.role);
    expect(users[0]).not.toHaveProperty("password");
  });

  test("should be able to list an user by email", async () => {
    await sut.create(createUserProps);

    const user = await sut.listByEmail(createUserProps.email);

    expect(user).toHaveProperty("id");
    expect(user?.name).toEqual(createUserProps.name);
    expect(user?.email).toEqual(createUserProps.email);
    expect(user?.phone).toEqual(createUserProps.phone);
    expect(user?.birthdate).toEqual(createUserProps.birthdate);
    expect(user?.role).toEqual(createUserProps.role);
    expect(user?.password).toEqual(createUserProps.password);
  });

  test("should be able to list an user by id", async () => {
    await sut.create(createUserProps);

    const user = await sut.listByEmail(createUserProps.email);

    const userMapped = await sut.listById(user!.id);

    expect(userMapped).toHaveProperty("id");
    expect(userMapped?.name).toEqual(createUserProps.name);
    expect(userMapped?.email).toEqual(createUserProps.email);
    expect(userMapped?.phone).toEqual(createUserProps.phone);
    expect(userMapped?.birthdate).toEqual(createUserProps.birthdate);
    expect(userMapped?.role).toEqual(createUserProps.role);
    expect(userMapped).not.toHaveProperty("password");
  });

  test("should be able to update an user password", async () => {
    await sut.create(createUserProps);
    const user = await sut.listByEmail(createUserProps.email);

    await expect(
      sut.updatePassword({
        id: user!.id,
        oldPassword: "any_password",
        newPassword: "new_password",
      })
    ).resolves.not.toThrow();
  });

  test("should be able to update an user profile", async () => {
    await sut.create(createUserProps);
    const user = await sut.listByEmail(createUserProps.email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      })
    ).resolves.not.toThrow();
  });

  test("should be able to update an user role", async () => {
    await sut.create(createUserProps);
    const user = await sut.listByEmail(createUserProps.email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "administrador",
      })
    ).resolves.not.toThrow();
  });
});
