import { AuthRepository, UserRepository } from "@/backend/data/repositories";
import {
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
  db,
} from "../../adapters/prisma";
import { EncrypterStub } from "@/backend/data/__mocks__";
import { EncrypterUseCase } from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";

interface SutTypes {
  sut: AuthRepository;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const sut = new PrismaAuthRepositoryAdapter(userRepository);
  const encrypter = new EncrypterStub();

  return { sut, encrypter, userRepository };
};

describe("PrismaAuthRepositoryAdapter", () => {
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => {
    return {
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
      ...overrides,
    };
  };

  const sutInstance = makeSut();
  const sut = sutInstance.sut;
  const encrypter = sutInstance.encrypter;
  const userRepository = sutInstance.userRepository;

  beforeAll(async () => {
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    await db.user.deleteMany({});
  });

  test("should be able to an user with correct data", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.authorize({
        email: createUserProps().email,
        password: createUserProps().password,
      })
    ).resolves.not.toThrow();
  });
});
