/**
 * Módulo de exportação para serviços relacionados a usuários
 *
 * Este arquivo centraliza a exportação de todos os serviços de usuário
 * implementados na camada de dados, seguindo o padrão de barril (barrel pattern).
 * Isso facilita a importação de serviços específicos de usuário em outros
 * módulos da aplicação.
 *
 * Os serviços aqui exportados implementam casos de uso relacionados
 * à entidade Usuário, como criação, atualização, busca e autenticação.
 *
 * @module data/services/user
 *
 * @example
 *
 * // Importação direta do serviço específico
 * import { UserCreateService } from "@/backend/data/services/user";
 *
 * // Alternativamente, através do barril principal
 * import { UserCreateService } from "@/backend/data/services";
 *
 * // Uso do serviço em um controlador
 * class UserController {
 *   constructor(private userCreateService: UserCreateService) {}
 *
 *   async createUser(req, res) {
 *     try {
 *       await this.userCreateService.create(req.body);
 *       return res.status(201).send();
 *     } catch (error) {
 *       // Tratamento de erro...
 *     }
 *   }
 * }
 *
 */

/** Exporta o serviço de criação de usuários */
export * from "./user-create";
