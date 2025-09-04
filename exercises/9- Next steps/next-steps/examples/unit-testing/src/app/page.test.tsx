import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, describe, it, vi } from "vitest";
import { axe } from "jest-axe";
import Home from "./page";
import { getData } from "@/services/getData";

vi.mock("@/services/getData", () => ({
  getData: vi.fn(() => Promise.resolve("buenas")),
}));

describe("Home Component", () => {
  it("renders counter with initial value of 0", () => {
    render(<Home />);

    expect(screen.getByText("Counter")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("increments counter when + button is clicked", () => {
    render(<Home />);

    const incrementButton = screen.getByRole("button", { name: "increment" });
    fireEvent.click(incrementButton);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  test("decrements counter when - button is clicked as long as it's bigger than 0", () => {
    render(<Home />);

    const decrementButton = screen.getByRole("button", { name: "decrement" });
    const incrementButton = screen.getByRole("button", { name: "increment" });
    fireEvent.click(decrementButton);

    expect(screen.getByText("0")).toBeInTheDocument();

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    fireEvent.click(decrementButton);

    expect(screen.getByText("1")).toBeInTheDocument();

    fireEvent.click(decrementButton);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("multiple increments work correctly", () => {
    render(<Home />);

    const incrementButton = screen.getByRole("button", { name: "increment" });
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  describe("Accessibility Tests", () => {
    it("should not have any accessibility violations", async () => {
      const { container } = render(<Home />);
      const results = await axe(container);
      expect(results.violations.length).toBe(0);
    });
  });

  describe("Data Fetching Tests", () => {
    it("should display data from the service", async () => {
      render(<Home />);

      const externalDataElement = screen.getByLabelText("external-data");
      expect(externalDataElement).toHaveTextContent("Data from Service:");
      expect(getData).not.toHaveBeenCalled();
      fireEvent.click(externalDataElement);
      expect(getData).toHaveBeenCalled();
      expect(await screen.findByLabelText("external-data")).toHaveTextContent(
        "Data from Service: buenas"
      );
    });
  });
});
