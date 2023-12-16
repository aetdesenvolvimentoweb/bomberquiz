import { GetByIdMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { Controller, HttpResponse } from "../../protocols";
import { httpError, success } from "../../helpers";

export class GetByIdMilitaryRankController implements Controller {
  constructor(
    private readonly getByIdMilitaryRankService: GetByIdMilitaryRankService
  ) {}

  handle = async (id: string): Promise<HttpResponse> => {
    try {
      await this.getByIdMilitaryRankService.getById(id);

      return success(null, 200);
    } catch (error: any) {
      return httpError(error);
    }
  };
}
