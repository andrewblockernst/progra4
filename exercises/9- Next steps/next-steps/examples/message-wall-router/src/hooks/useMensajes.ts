import type { Mensaje } from "../types";
import { useQuery } from "@tanstack/react-query";

export const BASE_URL = "http://localhost:4321/api";

export function useMensajes(search: string) {
  const queryKey = ["mensajes", search];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/mensajes?search=${search}`);
      const data: { messages: Mensaje[] } = await response.json();
      return data.messages;
    },
    initialData: [],
  });
}
