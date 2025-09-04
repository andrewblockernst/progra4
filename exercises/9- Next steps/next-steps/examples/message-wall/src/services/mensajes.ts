import type { Mensaje } from "../types";

const mensajes: Mensaje[] = [
  { content: "Mensaje 0", likes: 0, id: "0" },
  { content: "Mensaje 1", likes: 1, id: "1" },
  { content: "Mensaje 2", likes: 2, id: "2" },
  { content: "Mensaje 3", likes: 3, id: "3" },
  { content: "Mensaje 4", likes: 4, id: "4" },
];

export const getMensajes = (search: string) => {
  return mensajes.filter((mensaje) =>
    mensaje.content.toLowerCase().includes(search.toLowerCase())
  );
};

export const addMensaje = (content: string) => {
  const newMessage = { content, likes: 0, id: crypto.randomUUID() };
  mensajes.push(newMessage);
  return newMessage;
};

export const likeMensaje = (id: string) => {
  const mensaje = mensajes.find((mensaje) => mensaje.id === id);
  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }
  mensaje.likes++;
  return mensaje;
};

export const deleteMensaje = (id: string) => {
  const mensaje = mensajes.find((mensaje) => mensaje.id === id);
  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }
  const index = mensajes.indexOf(mensaje);
  mensajes.splice(index, 1);
  return mensaje;
};
