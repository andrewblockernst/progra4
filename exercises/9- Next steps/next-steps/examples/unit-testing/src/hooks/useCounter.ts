import { useState } from "react";

export function useCounter(
  initialValue: number,
  callback?: (value: number) => void
) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => {
      const newValue = prev + 1;
      if (callback) callback(newValue);
      return newValue;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      const newValue = Math.max(prev - 1, 0);
      if (callback) callback(newValue);
      return newValue;
    });
  };

  return { count, increment, decrement };
}
