import { fireEvent, render, screen } from "@testing-library/react";
import { describe, vi } from "vitest";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("renders correctly", () => {
    render(<Counter />);

    expect(
      screen.getByRole("heading", { name: /counter/i })
    ).toBeInTheDocument();
  });

  it("initial count can be set", () => {
    render(<Counter initialCount={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("increments the count", () => {
    const onChangeMock = vi.fn();
    render(<Counter onChange={onChangeMock} />);
    const incrementButton = screen.getByRole("button", { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(onChangeMock).toHaveBeenCalledWith(1);
  });

  it("decrements the count", () => {
    render(<Counter initialCount={1} />);
    const decrementButton = screen.getByRole("button", { name: /decrement/i });
    fireEvent.click(decrementButton);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
