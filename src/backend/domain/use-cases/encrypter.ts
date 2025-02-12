/**
 * Define o contrato para criptografia de senhas no sistema
 */
export interface EncrypterUseCase {
  /**
   * Criptografa uma senha
   * @param password Senha em texto puro
   * @returns Promise com a senha criptografada
   */
  encrypt: (password: string) => Promise<string>;

  /**
   * Verifica se uma senha corresponde ao hash
   * @param props Objeto com senha e hash para verificação
   * @returns Promise com boolean indicando se a senha está correta
   */
  verify: (props: {
    password: string;
    passwordHash: string;
  }) => Promise<boolean>;
}
