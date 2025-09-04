"use client";

import { getData } from "@/services/getData";
import { useEffect, useState } from "react";
import { Counter } from "./Counter";

export default function Home() {
  const [data, setData] = useState("");

  const fetchData = async () => {
    const result = await getData();
    setData(result);
  };
  // useEffect(() => {

  //   fetchData();
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1
          className="text-2xl font-bold mb-4"
          aria-label="external-data"
          onClick={fetchData}
        >
          Data from Service: {data}
        </h1>
        <Counter />
      </div>
    </div>
  );
}
