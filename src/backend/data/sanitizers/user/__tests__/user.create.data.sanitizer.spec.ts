import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateDataSanitizer } from "../user.create.data.sanitizer";

describe("UserCreateDataSanitizer", () => {
  let userCreateDataSanitizer: UserCreateDataSanitizer;

  beforeEach(() => {
    userCreateDataSanitizer = new UserCreateDataSanitizer();
  });

  it("should sanitize all user data correctly", () => {
    const userData = {
      name: "  John Doe  ",
      email: "  EMAIL@example.com  ",
      phone: "(11) 98765-4321",
      birthdate: new Date(),
      password: "  password123  ",
    } as UserCreateData;

    const sanitized = userCreateDataSanitizer.sanitize(userData);

    expect(sanitized.name).toBe("John Doe");
    expect(sanitized.email).toBe("email@example.com");
    expect(sanitized.phone).toBe("11987654321");
    expect(sanitized.password).toBe("password123");
    expect(sanitized.birthdate).toBe(userData.birthdate);
  });

  // Testes parametrizados para sanitização de campos individuais
  describe("sanitize individual fields", () => {
    const testCases = [
      {
        field: "name",
        input: "  John Doe  ",
        expected: "John Doe",
        description: "should trim name",
      },
      {
        field: "email",
        input: "  EMAIL@example.com  ",
        expected: "email@example.com",
        description: "should trim and lowercase email",
      },
      {
        field: "phone",
        input: "(11) 98765-4321",
        expected: "11987654321",
        description: "should remove non-numeric characters from phone",
      },
      {
        field: "password",
        input: "  password123  ",
        expected: "password123",
        description: "should trim password",
      },
    ];

    test.each(testCases)("$description", ({ field, input, expected }) => {
      // Cria um objeto com apenas o campo a ser testado
      const data = {
        [field]: input,
        birthdate: new Date(), // Sempre incluímos birthdate para ter um objeto válido
      } as unknown as UserCreateData;

      const sanitized = userCreateDataSanitizer.sanitize(data);
      expect(sanitized[field as keyof UserCreateData]).toBe(expected);
    });
  });

  // Testes parametrizados para campos undefined
  describe("handle undefined fields", () => {
    const fields = ["name", "email", "phone", "password"];

    test.each(fields)("should handle undefined %s", (field) => {
      // Cria um objeto com todos os campos exceto o que está sendo testado
      const testData: Partial<UserCreateData> = {
        birthdate: new Date(),
      };

      // Adiciona todos os campos exceto o que está sendo testado
      if (field !== "name") testData.name = "John";
      if (field !== "email") testData.email = "test@example.com";
      if (field !== "phone") testData.phone = "123456789";
      if (field !== "password") testData.password = "pass123";

      const sanitized = userCreateDataSanitizer.sanitize(
        testData as UserCreateData,
      );
      expect(sanitized[field as keyof UserCreateData]).toBeUndefined();
    });
  });

  it("should handle multiple undefined values correctly", () => {
    // Criando um objeto com propriedades potencialmente undefined
    const incompleteData = {
      name: "John Doe",
      birthdate: new Date(),
    } as UserCreateData;

    const sanitized = userCreateDataSanitizer.sanitize(incompleteData);

    // Verificando que não ocorrem erros e que os valores undefined permanecem undefined
    expect(sanitized.name).toBe("John Doe");
    expect(sanitized.email).toBeUndefined();
    expect(sanitized.phone).toBeUndefined();
    expect(sanitized.password).toBeUndefined();
    expect(sanitized.birthdate).toBe(incompleteData.birthdate);
  });
});
