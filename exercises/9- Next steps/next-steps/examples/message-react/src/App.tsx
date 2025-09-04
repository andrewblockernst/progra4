import "./App.css";
import { FilterForm } from "./components/FilterForm";
import { NuevoMensajeForm } from "./components/NuevoMensajeForm";
import { MensajeList } from "./components/MensajeList";
import { useCallback, useEffect, useState } from "react";
import type { Mensaje } from "./types";
import { useDebounce } from "./utils/useDebounce";
import { Stats } from "./components/Stats";

const BASE_URL = "http://localhost:4321/api";

function App() {
  const [search, setSearch] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const debouncedSearch = useDebounce(search, 500);

  const addMensaje = useCallback(
    async (content: string) => {
      const response = await fetch(`${BASE_URL}/mensajes`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: { message: Mensaje } = await response.json();
      setMensajes((current) => [...current, data.message]);
    },
    [setMensajes]
  );

  const increaseLike = async (id: string) => {
    const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "like" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { mensaje: Mensaje } = await response.json();
    setMensajes((current) =>
      current.map((item) =>
        item.id === data.mensaje.id
          ? { ...item, likes: data.mensaje.likes }
          : item
      )
    );
  };

  const removeItem = async (id: string) => {
    const response = await fetch(`${BASE_URL}/mensajes/${id}`, {
      method: "POST",
      body: JSON.stringify({ action: "delete" }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data: { mensaje: Mensaje } = await response.json();
    setMensajes((current) =>
      current.filter((item) => item.id !== data.mensaje.id)
    );
  };

  useEffect(() => {
    const fetchMensajes = async () => {
      const response = await fetch(
        `${BASE_URL}/mensajes?search=${debouncedSearch}`
      );
      const data: { messages: Mensaje[] } = await response.json();
      setMensajes(data.messages);
    };
    fetchMensajes();
  }, [debouncedSearch]);

  return (
    <>
      <Stats mensajes={mensajes} />
      <section className="min-w-[50vw] flex flex-col gap-4 border border-gray-300 rounded-md p-8 m-8">
        <FilterForm search={search ?? ""} setSearch={setSearch} />
        <NuevoMensajeForm addMensaje={addMensaje} />
      </section>

      <MensajeList
        mensajes={mensajes}
        increaseLike={increaseLike}
        removeItem={removeItem}
      />
    </>
  );
}

export default App;
