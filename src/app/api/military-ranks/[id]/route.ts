import { adaptRouteNextjs } from "@/modules/backend/application/adapters";
import { makeGetByIdMilitaryRankController } from "@/modules/backend/application/factories/controllers/get-by-id-military-rank-controller-factory";
import { HttpRequest } from "@/modules/backend/presentation/protocols";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> => {
  const httpRequest: HttpRequest = { params };
  return await adaptRouteNextjs(
    makeGetByIdMilitaryRankController(),
    httpRequest
  );
};
