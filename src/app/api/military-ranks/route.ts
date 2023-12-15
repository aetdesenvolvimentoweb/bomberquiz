import { adaptRouteNextjs } from "@/modules/backend/application/adapters";
import {
  makeAddMilitaryRankController,
  makeGetAllMilitaryRankController,
} from "@/modules/backend/application/factories/controllers";

export const POST = async (request: Request) => {
  return await adaptRouteNextjs(makeAddMilitaryRankController(), request);
};

export const GET = async (request: Request) => {
  return await adaptRouteNextjs(makeGetAllMilitaryRankController(), request);
};
