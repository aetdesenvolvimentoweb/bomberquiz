import { GetAllMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { Controller, HttpResponse } from "../../protocols";
import { httpError, success } from "../../helpers";

export class GetAllMilitaryRankController implements Controller {
  constructor(
    private readonly getAllMilitaryRankService: GetAllMilitaryRankService
  ) {}

  handle = async (): Promise<HttpResponse> => {
    try {
      const militaryRanks = await this.getAllMilitaryRankService.getAll();

      return success(militaryRanks);
    } catch (error: any) {
      return httpError(error);
    }
  };
}
