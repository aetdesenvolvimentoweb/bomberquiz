export type UserRole = "administrador" | "colaborador" | "cliente";

export type UserProfileProps = {
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
};

export type UserProps = UserProfileProps & {
  password: string;
  role: UserRole;
};

export type UserProfile = UserProfileProps & {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type User = UserProps & {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserMapped = Omit<User, "password">;
