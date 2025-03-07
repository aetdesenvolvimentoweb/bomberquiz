import {
  User,
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  UserCreateData,
} from "@/backend/domain/entities";
import { UserRepository } from "@/backend/domain/repositories";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public readonly create = async (data: UserCreateData): Promise<void> => {
    console.log("dentro repositório", data.birthdate);
    const user = Object.assign({}, data, {
      id: crypto.randomUUID(),
      avatarUrl: USER_DEFAULT_AVATAR_URL,
      role: USER_DEFAULT_ROLE,
      password: "hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.users.push(user);
  };

  public readonly findByEmail = async (email: string): Promise<User | null> => {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  };
}
