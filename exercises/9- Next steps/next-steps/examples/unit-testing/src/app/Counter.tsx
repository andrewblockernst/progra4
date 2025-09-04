import { useCounter } from "@/hooks/useCounter";
import { useEffect, useState } from "react";

type CounterProps = {
  initialCount?: number;
  onChange?: (count: number) => void;
};

export function Counter({ initialCount = 0, onChange }: CounterProps) {
  const { count, increment, decrement } = useCounter(initialCount, onChange);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Counter</h1>
      <div className="text-6xl font-mono mb-8">{count}</div>
      <div className="flex gap-4">
        <button
          onClick={decrement}
          aria-label="decrement"
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xl font-semibold"
        >
          -
        </button>
        <button
          onClick={increment}
          aria-label="increment"
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xl font-semibold"
        >
          +
        </button>
      </div>
    </>
  );
}
