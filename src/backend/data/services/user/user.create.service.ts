import { HashUseCase } from "@/backend/domain/usecases/hash";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateValidatorUseCase } from "@/backend/domain/validators";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

/**
 * Interface que define as dependências necessárias para o serviço de criação de usuário
 */
interface UserCreateServiceProps {
  /** Repositório para persistência de dados do usuário */
  repository: UserRepository;
  /** Sanitizador para limpar e formatar os dados de entrada */
  sanitizer: UserCreateDataSanitizerUseCase;
  /** Validador para garantir que os dados atendem aos requisitos */
  validator: UserCreateValidatorUseCase;
  /** Hash para criptografar a senha do usuário */
  hashProvider: HashUseCase;
}

/**
 * Implementação do serviço de criação de usuário
 * Orquestra o fluxo de sanitização, validação e persistência dos dados
 * @implements {UserCreateUseCase}
 */
export class UserCreateService implements UserCreateUseCase {
  /**
   * Cria uma instância do serviço de criação de usuário
   * @param props Dependências necessárias para o serviço
   */
  constructor(private readonly props: UserCreateServiceProps) {}

  /**
   * Cria um novo usuário no sistema
   * O processo segue a ordem:
   * 1. Sanitização dos dados de entrada
   * 2. Validação dos dados sanitizados
   * 3. Criptografia da senha
   * 4. Persistência dos dados no repositório
   *
   * @param data Dados do usuário a ser criado
   * @throws {MissingParamError} Se algum campo obrigatório estiver faltando
   * @throws {InvalidParamError} Se algum campo for inválido
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado
   */
  public readonly create = async (data: UserCreateData): Promise<void> => {
    const { hashProvider, repository, sanitizer, validator } = this.props;

    sanitizer.sanitize(data);
    await validator.validate(data);
    const hashPassword = await hashProvider.hash(data.password);
    await repository.create({
      ...data,
      password: hashPassword,
    });
  };
}
