import {
  UpdateUserPasswordProps,
  UpdateUserRoleProps,
  User,
  UserMapped,
  UserProfile,
  UserProps,
} from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { randomUUID } from "crypto";

export class UserRepositoryInMemory implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  private userMapped = (user: User): UserMapped => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  public readonly create = async (userProps: UserProps): Promise<void> => {
    const user: User = {
      ...userProps,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
  };

  public readonly delete = async (id: string): Promise<void> => {
    this.users = this.users.filter((user) => user.id !== id);
  };

  public readonly listAll = async (): Promise<UserMapped[]> => {
    return this.users.map((user) => this.userMapped(user));
  };

  public readonly listByEmail = async (email: string): Promise<User | null> => {
    return this.users.find((user) => user.email === email) || null;
  };

  public readonly listById = async (id: string): Promise<UserMapped | null> => {
    return this.users.find((user) => user.id === id) || null;
  };

  public readonly updatePassword = async (
    updateUserPasswordProps: UpdateUserPasswordProps
  ): Promise<void> => {
    this.users = this.users.map((user) => {
      if (user.id === updateUserPasswordProps.id) {
        return {
          ...user,
          password: updateUserPasswordProps.newPassword,
          updatedAt: new Date(),
        };
      }

      return user;
    });
  };

  public readonly updateProfile = async (
    userProfile: UserProfile
  ): Promise<void> => {
    this.users = this.users.map((user) => {
      if (user.id === userProfile.id) {
        return {
          ...user,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          birthdate: userProfile.birthdate,
          updatedAt: new Date(),
        };
      }

      return user;
    });
  };

  public readonly updateRole = async (
    updateUserRoleProps: UpdateUserRoleProps
  ): Promise<void> => {
    this.users = this.users.map((user) => {
      if (user.id === updateUserRoleProps.id) {
        return {
          ...user,
          role: updateUserRoleProps.role,
          updatedAt: new Date(),
        };
      }

      return user;
    });
  };
}
