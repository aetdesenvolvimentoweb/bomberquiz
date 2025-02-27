import { MissingParamError } from "@/backend/domain/errors";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateValidator } from "@/backend/data/validators/user/user.create.validator";
import { UserCreateValidatorUseCase } from "../user.create.validator";

interface SutResponses {
  sut: UserCreateValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const sut = new UserCreateValidator();

  return {
    sut,
  };
};

describe("UserCreateValidator", () => {
  it("should throw a MissingParamError if name is not provided", async () => {
    const { sut } = makeSut();

    await expect(
      sut.validate({
        email: "any_email",
        phone: "any_phone",
        birthdate: new Date(),
        password: "any_password",
      } as UserCreateData),
    ).rejects.toThrow(new MissingParamError("nome"));
  });

  it("should throw a MissingParamError if email is not provided", async () => {
    const { sut } = makeSut();

    await expect(
      sut.validate({
        name: "any_name",
        phone: "any_phone",
        birthdate: new Date(),
        password: "any_password",
      } as UserCreateData),
    ).rejects.toThrow(new MissingParamError("email"));
  });
});
