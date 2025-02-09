/**
 * Representa as credenciais necessárias para login
 */
export interface LoginProps {
  email: string;
  password: string;
}

/**
 * Representa os dados do usuário após autenticação
 */
export interface UserLogged {
  readonly id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

/**
 * Representa os tipos de token disponíveis no sistema
 */
export type TokenType = "access" | "refresh";

/**
 * Representa as informações de um token
 */
export interface TokenInfo {
  value: string;
  type: TokenType;
  expiresIn: Date;
}

/**
 * Representa uma sessão de autenticação
 */
export interface Auth {
  readonly id: string;
  readonly userId: string;
  accessToken: TokenInfo;
  refreshToken: TokenInfo;
  readonly createdAt: Date;
  updatedAt: Date;
}
