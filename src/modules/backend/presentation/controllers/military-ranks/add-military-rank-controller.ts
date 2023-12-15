import {
  Controller,
  HttpResponse,
} from "@/modules/backend/presentation/protocols";
import { httpError, success } from "@/modules/backend/presentation/helpers";
import { AddMilitaryRankService } from "@/modules/backend/data/usecases/military-rank";
import { AddMilitaryRankModel } from "@/modules/backend/domain/models";

export class AddMilitaryRankController implements Controller {
  constructor(
    private readonly addMilitaryRankService: AddMilitaryRankService
  ) {}

  handle = async (data: AddMilitaryRankModel): Promise<HttpResponse> => {
    try {
      await this.addMilitaryRankService.add(data);

      return success(null, 201);
    } catch (error: any) {
      return httpError(error);
    }
  };
}
