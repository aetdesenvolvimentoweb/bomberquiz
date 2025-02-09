/**
 * Representa os diferentes papéis que um usuário pode ter no sistema.
 */
export type UserRole = "administrador" | "colaborador" | "cliente";

/**
 * Representa as propriedades que compõem o perfil de um usuário.
 * @property {string} email Deve ser um endereço de email válido
 * @property {Date} birthdate Deve ser uma data válida no passado, pelo menos 18 anos atrás
 */
export interface UserProfileProps {
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
}

/**
 * Representa as propriedades que compõem a conta de um usuário, incluindo informações de perfil e credenciais de autenticação.
 */
export interface UserProps extends UserProfileProps {
  password: string;
  role: UserRole;
}

/**
 * Representa o perfil de um usuário, incluindo seu identificador único, data de criação e última atualização.
 */
export interface UserProfile extends UserProfileProps {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

/**
 * Representa a conta de um usuário, incluindo informações de perfil, credenciais de autenticação, identificador único e carimbos de data/hora.
 */
export interface User extends UserProps {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;
}

/**
 * Representa as propriedades necessárias para atualizar a senha de um usuário.
 */
export interface UpdateUserPasswordProps {
  oldPassword: string;
  newPassword: string;
}

/**
 * Representa a conta de um usuário, excluindo a propriedade senha.
 */
export type UserMapped = Omit<User, "password">;
