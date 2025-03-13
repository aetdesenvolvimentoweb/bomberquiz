import { BasicXssSanitizer } from "@/backend/data/sanitizers/security";
import { XssSanitizerUseCase } from "@/backend/domain/sanitizers/security";

describe("BasicXssSanitizer", () => {
  let sut: XssSanitizerUseCase;

  beforeEach(() => {
    sut = new BasicXssSanitizer();
  });

  const testCases = [
    {
      scenario: "script tag",
      input: '<script>alert("XSS")</script>',
      expected: '&lt;scrīpt&gt;alert("XSS")&lt;/scrīpt&gt;',
    },
    {
      scenario: "onclick attribute",
      input: '<a href="#" onclick="alert(1)">Click me</a>',
      expected:
        '&lt;a href="#" data-disabled-event="alert(1)"&gt;Click me&lt;/a&gt;',
    },
    {
      scenario: "javascript: protocol",
      input: '<a href="javascript:alert(1)">Click me</a>',
      expected: '&lt;a href="disabled-js:alert(1)"&gt;Click me&lt;/a&gt;',
    },
    {
      scenario: "mixed case XSS attempt",
      input: '<ScRiPt>alert("XSS")</sCrIpT>',
      expected: '&lt;ScRīPt&gt;alert("XSS")&lt;/sCrīpT&gt;',
    },
    {
      scenario: "null input",
      input: null as unknown as string,
      expected: null as unknown as string,
    },
    {
      scenario: "empty string",
      input: "",
      expected: "",
    },
  ];

  test.each(testCases)(
    "should sanitize $scenario correctly",
    ({ input, expected }) => {
      const result = sut.sanitize(input);
      expect(result).toBe(expected);
    },
  );
});
