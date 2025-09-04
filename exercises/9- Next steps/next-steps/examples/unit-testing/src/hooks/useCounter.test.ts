import { act, renderHook } from "@testing-library/react";
import { describe } from "vitest";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should initialize with the correct value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("should increment the count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it("should decrement the count", () => {
    const { result } = renderHook(() => useCounter(1));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });

  it("should not decrement below 0", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });
});
