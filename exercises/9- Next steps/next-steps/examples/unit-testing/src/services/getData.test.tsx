import { describe } from "vitest";
import { getData } from "./getData";

describe("getData", () => {
  it("should return data from the API", async () => {
    const data = await getData();
    expect(data).toEqual("hola mundo");
  });
});
