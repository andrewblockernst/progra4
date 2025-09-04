import type { FormEvent } from "react";
import { BASE_URL } from "../hooks/useMensajes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Mensaje } from "../types";
import { useAuth } from "../hooks/useAuth";

type NuevoMensajeFormProps = {
  search: string;
};

export function NuevoMensajeForm({ search }: NuevoMensajeFormProps) {
  const queryClient = useQueryClient();
  const queryKey = ["mensajes", search];
  const { token } = useAuth();

  const { mutate: addMensaje } = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`${BASE_URL}/walls`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data: { message: Mensaje } = await response.json();
      return data.message;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, (old: Mensaje[]) => [...old, data]);
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const content = formData.get("content")?.toString();

    if (!content) {
      return alert("Completa el formulario, boludo.");
    }

    addMensaje(content);
    target.reset();
  }

  return (
    <form
      action="/api/mensajes"
      method="post"
      className="flex w-full justify-between gap-2"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-gray-300 rounded-md p-2 flex-1"
        type="text"
        name="content"
        placeholder="Contenido del mensaje"
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 cursor-pointer"
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
}
