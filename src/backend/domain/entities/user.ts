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
  /** Identificador único do usuário */
  id: string;
  /** Nome completo do usuário */
  name: string;
  /** Endereço de e-mail do usuário */
  email: string;
  /** Número de telefone do usuário */
  phone: string;
  /** Data de nascimento do usuário */
  birthdate: Date;
  /** URL da imagem de avatar do usuário (opcional) */
  avatarUrl?: string;
  /** Papel/função do usuário no sistema (opcional) */
  role?: UserRole;
  /** Senha criptografada do usuário */
  password: string;
  /** Data de criação do registro do usuário */
  createdAt: Date;
  /** Data da última atualização do registro do usuário */
  updatedAt: Date;
}

/**
 * Type que representa um usuário sem o campo password
 * Útil para retornar informações do usuário sem expor dados sensíveis
 * @typedef {Omit<User, "password">}
 */
export type UserMapped = Omit<User, "password">;

/**
 * Type que define os dados necessários para criar um usuário
 * Omite campos que são gerados automaticamente ou opcionais
 * @typedef {Omit<User, "id" | "avatarUrl" | "role" | "createdAt" | "updatedAt">}
 */
export type UserCreateData = Omit<
  User,
  "id" | "avatarUrl" | "role" | "createdAt" | "updatedAt"
>;

/**
 * Type que define os dados para atualização de avatar
 * @typedef {Object} UserUpdateAvatarData
 * @property {string} id - Identificador único do usuário
 * @property {string} avatarUrl - Nova URL da imagem de avatar
 */
export type UserUpdateAvatarData = {
  id: string;
  avatarUrl: string;
};

/**
 * Type que define os dados para atualização de senha
 * @typedef {Object} UserUpdatePasswordData
 * @property {string} id - Identificador único do usuário
 * @property {string} currentPassword - Senha atual para verificação
 * @property {string} newPassword - Nova senha desejada
 * @property {string} confirmNewPassword - Confirmação da nova senha
 */
export type UserUpdatePasswordData = {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

/**
 * Type que define os dados para atualização do perfil
 * Omite campos que não devem ser atualizados neste contexto
 * @typedef {Omit<User, "avatarUrl" | "role" | "password" | "createdAt" | "updatedAt">}
 */
export type UserUpdateProfileData = Omit<
  User,
  "avatarUrl" | "role" | "password" | "createdAt" | "updatedAt"
>;

/**
 * Type que define os dados para atualização do papel do usuário
 * @typedef {Object} UserUpdateRoleData
 * @property {string} id - Identificador único do usuário
 * @property {UserRole} role - Novo papel/função do usuário
 */
export type UserUpdateRoleData = {
  id: string;
  role: UserRole;
};

/**
 * URL padrão para avatar de usuário quando nenhum for fornecido
 * @constant {string}
 */
export const USER_DEFAULT_AVATAR_URL =
  "/src/frontend/assets/images/default-avatar.png";

/**
 * Papel/função padrão atribuído a novos usuários
 * @constant {UserRole}
 */
export const USER_DEFAULT_ROLE = UserRole.CLIENTE;
