import { render, screen } from "@testing-library/react";
import Home from "@/app/(home)/page";

describe("Page Home", () => {
  test("should render a heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Hello BomberQuiz!" })
    ).toBeInTheDocument();
  });
});
