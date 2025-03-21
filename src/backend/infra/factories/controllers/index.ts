/**
 * Barrel file for controller factories
 *
 * This file consolidates and re-exports all domain-specific controller factories,
 * providing a centralized entry point for importing any controller factory in the application.
 *
 * Current exports include:
 * - User controller factories
 *
 * This pattern simplifies imports and provides a clean API for accessing
 * controller factory functions throughout the application.
 *
 * @example
 * // Instead of:
 * import { makeUserCreateController } from "@/backend/infra/factories/controllers/user/make-user-create-controller";
 *
 * // You can use:
 * import { makeUserCreateController } from "@/backend/infra/factories/controllers";
 *
 * @module ControllerFactories
 */

export * from "./user";
