import { GetByIdMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { httpError, success } from "../../helpers";

export class GetByIdMilitaryRankController implements Controller {
  constructor(
    private readonly getByIdMilitaryRankService: GetByIdMilitaryRankService
  ) {}

  handle = async (request: HttpRequest): Promise<HttpResponse> => {
    const id = request.params!.id;
    try {
      const militaryRank = await this.getByIdMilitaryRankService.getById(id);

      return success(militaryRank, 200);
    } catch (error: any) {
      return httpError(error);
    }
  };
}
