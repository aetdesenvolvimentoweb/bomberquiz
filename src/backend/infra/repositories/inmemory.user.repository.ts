import {
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  User,
  UserCreateData,
} from "@/backend/domain/entities";
import { ObjectId } from "mongodb";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  public readonly create = async (data: UserCreateData): Promise<void> => {
    const id = new ObjectId().toString();
    const createdAt = new Date();
    const updatedAt = new Date();
    this.users.push({
      ...data,
      id,
      avatarUrl: USER_DEFAULT_AVATAR_URL,
      role: USER_DEFAULT_ROLE,
      createdAt,
      updatedAt,
    });
  };

  public readonly findByEmail = async (email: string): Promise<User | null> => {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  };
}
