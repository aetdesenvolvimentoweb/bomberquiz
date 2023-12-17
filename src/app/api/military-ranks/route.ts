import { adaptRouteNextjs } from "@/modules/backend/application/adapters";
import {
  makeAddMilitaryRankController,
  makeGetAllMilitaryRankController,
} from "@/modules/backend/application/factories/controllers";

export const POST = async (request: Request) => {
  const httpRequest = { body: await request.json() };
  return await adaptRouteNextjs(makeAddMilitaryRankController(), httpRequest);
};

export const GET = async (request: Request) => {
  const httpRequest = {};
  return await adaptRouteNextjs(
    makeGetAllMilitaryRankController(),
    httpRequest
  );
};
