import { adaptRouteNextjs } from "@/modules/backend/application/adapters/adapt-route-nextjs";
import { makeAddMilitaryRankController } from "@/modules/backend/application/factories/controllers";

export const POST = async (request: Request) => {
  return await adaptRouteNextjs(makeAddMilitaryRankController(), request);
};
