/**
 * Enum que define os tipos de papéis de usuário no sistema
 * @enum {string}
 */
export enum UserRole {
  ADMINISTRADOR = "administrador",
  COLABORADOR = "colaborador",
  CLIENTE = "cliente",
}

/**
 * Interface que define a estrutura completa de um usuário
 * @interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
  avatarUrl?: string;
  role?: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Type que representa um usuário sem o campo password */
export type UserMapped = Omit<User, "password">;

/** Type que define os dados necessários para criar um usuário */
export type UserCreateData = Omit<
  User,
  "id" | "avatarUrl" | "role" | "createdAt" | "updatedAt"
>;

/** Type que define os dados para atualização de avatar */
export type UserUpdateAvatarData = {
  id: string;
  avatarUrl: string;
};

/** Type que define os dados para atualização de senha */
export type UserUpdatePasswordData = {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/** Type que define os dados para atualização do perfil */
export type UserUpdateProfileData = Omit<
  User,
  "avatarUrl" | "role" | "password" | "createdAt" | "updatedAt"
>;

/** Type que define os dados para atualização do papel do usuário */
export type UserUpdateRoleData = {
  id: string;
  role: UserRole;
};
