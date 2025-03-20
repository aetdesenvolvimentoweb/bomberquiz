/**
 * Módulo de exportação para todos os controladores da aplicação
 *
 * Este arquivo centraliza a exportação de todos os controladores da camada de
 * apresentação, organizados por domínio ou entidade de negócio, seguindo o padrão
 * de barril (barrel pattern). Isso permite importar qualquer controlador a partir
 * de um único ponto de entrada, simplificando as importações em outros módulos.
 *
 * Os controladores são componentes responsáveis por:
 * - Receber e validar requisições HTTP
 * - Extrair e preparar dados para processamento
 * - Delegar a lógica de negócio para os serviços apropriados
 * - Formatar e retornar respostas HTTP padronizadas
 * - Tratar erros de forma consistente
 *
 * @module presentation/controllers
 *
 * @example
 *
 * // Importação simplificada de controladores de diferentes entidades
 * import { UserCreateController } from "@/backend/presentation/controllers";
 *
 * // Configuração de um adaptador para conectar o framework web aos controladores
 * const adaptRoute = (controller) => {
 *   return async (req, res) => {
 *     const httpRequest = {
 *       body: req.body,
 *       params: req.params,
 *       query: req.query,
 *       headers: req.headers
 *     };
 *
 *     const httpResponse = await controller.handle(httpRequest);
 *
 *     res.status(httpResponse.statusCode).json(httpResponse.body);
 *   };
 * };
 *
 * // Uso em uma aplicação Express
 * app.post('/api/users', adaptRoute(new UserCreateController(dependencies)));
 */

/** Exporta todos os controladores relacionados à entidade Usuário */
export * from "./user";
