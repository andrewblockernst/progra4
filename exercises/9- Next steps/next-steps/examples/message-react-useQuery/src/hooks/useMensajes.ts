import type { Mensaje } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const BASE_URL = "http://localhost:3000/api";

export function useMensajes(search: string) {
  const queryKey = ["mensajes", search];
  const { token } = useAuth();

  console.log(token);

  return useQuery({
    queryKey,
    enabled: !!token,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/walls?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: { walls: Mensaje[] } = await response.json();
      return data.walls;
    },
    initialData: [],
  });
}
