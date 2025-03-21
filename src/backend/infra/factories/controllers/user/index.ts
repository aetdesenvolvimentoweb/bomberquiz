/**
 * Barrel file for User controller factories
 *
 * This file consolidates and re-exports all controller factory functions
 * related to User domain entities, making it easier to import them from
 * a single location.
 *
 * @example
 * // Instead of:
 * import { makeUserCreateController } from "@/backend/infra/factories/controllers/user/make-user-create-controller";
 *
 * // You can use:
 * import { makeUserCreateController } from "@/backend/infra/factories/controllers/user";
 *
 * @module UserControllerFactories
 */

export * from "./make-user-create-controller";
