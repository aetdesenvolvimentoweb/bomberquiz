/**
 * Módulo de exportação para controladores de usuário
 *
 * Este arquivo centraliza a exportação de todos os controladores relacionados
 * à entidade Usuário, seguindo o padrão de barril (barrel pattern). Isso permite
 * importar qualquer controlador de usuário a partir de um único ponto de entrada,
 * simplificando as importações em outros módulos.
 *
 * Os controladores exportados são responsáveis por processar requisições HTTP,
 * delegando a lógica de negócio para os serviços apropriados e formatando
 * as respostas de acordo com o padrão da API.
 *
 * @module presentation/controllers/user
 *
 * @example
 *
 * // Importação simplificada do controlador
 * import { UserCreateController } from "@/backend/presentation/controllers/user";
 *
 * // Configuração de rotas
 * const makeUserCreateController = () => {
 *   return new UserCreateController({
 *     userCreateService: makeUserCreateService(),
 *     loggerProvider: makeLoggerProvider()
 *   });
 * };
 *
 * app.post('/api/users', adaptRoute(makeUserCreateController()));
 */

/** Exporta o controlador para criação de usuários */
export * from "./user-create-controller";
