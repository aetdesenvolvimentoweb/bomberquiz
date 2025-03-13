/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { UserBirthdateValidatorUseCase } from "@/backend/domain/validators";

import { UserBirthdateValidatorAdapter } from "../user.birthdate.validator.adapter";

interface SutResponses {
  sut: UserBirthdateValidatorUseCase;
}

const makeSut = (): SutResponses => {
  const sut = new UserBirthdateValidatorAdapter();

  return {
    sut,
  };
};

describe("UserBirthdateValidatorAdapter", () => {
  let sut: UserBirthdateValidatorUseCase;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
  });

  it("should validate birthdate correctly", async () => {
    await expect(
      sut.validate(new Date("2007-01-01T00:00:00.000Z")),
    ).resolves.not.toThrow();
  });

  it("should throw an error when birthdate format is invalid", async () => {
    await expect(
      sut.validate("invalid-data" as unknown as Date),
    ).rejects.toThrow(new InvalidParamError("data de nascimento"));
  });

  it("should throw an error when birthdate is less than 18 years old", async () => {
    await expect(sut.validate(new Date())).rejects.toThrow(
      new InvalidParamError("data de nascimento"),
    );
  });

  it("should throw an error when birthdate is exactly 18 years old but not yet 18 years old by month", async () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 18);
    birthdate.setMonth(birthdate.getMonth() + 1);
    await expect(sut.validate(birthdate)).rejects.toThrow(
      new InvalidParamError("data de nascimento"),
    );
  });

  it("should throw an error when birthdate is exactly 18 years old but not yet 18 years old by day in the same month", async () => {
    const birthdate = new Date();
    birthdate.setFullYear(birthdate.getFullYear() - 18);
    birthdate.setDate(birthdate.getDate() + 1);
    await expect(sut.validate(birthdate)).rejects.toThrow(
      new InvalidParamError("data de nascimento"),
    );
  });

  describe("import test", () => {
    it("should throw if date-fns not imported", async () => {
      const importError = new Error("date-fns não importado");

      // Usar cast para 'any' para acessar o método protegido
      jest.spyOn(sut as any, "importDateFns").mockImplementationOnce(() => {
        throw importError;
      });

      const validDate = new Date("2000-01-01");

      // Verificar se o erro correto é lançado
      await expect(sut.validate(validDate)).rejects.toThrow(
        new ServerError(importError),
      );
    });

    it("should throw if date-fns isDate function is not available", async () => {
      const validDate = new Date("2000-01-01");
      // Usar cast para 'any' para acessar o método protegido
      jest.spyOn(sut as any, "importDateFns").mockResolvedValueOnce({
        isDate: null,
      });
      // Verificar se o erro correto é lançado
      await expect(sut.validate(validDate)).rejects.toThrow(
        new ServerError(new Error("date-fns não importado")),
      );
    });
  });
});
