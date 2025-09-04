import type { Mensaje } from "../types";
import { MensajeItem } from "./MensajeItem";

type MensajeItemProps = {
  mensajes: Mensaje[];
  increaseLike: (id: string) => void;
  removeItem: (id: string) => void;
};

export function MensajeList({
  mensajes,
  increaseLike,
  removeItem,
}: MensajeItemProps) {
  return (
    <ul id="message-list" className="flex flex-col gap-2 w-full">
      {mensajes.map((mensaje) => (
        <MensajeItem
          key={mensaje.id}
          mensaje={mensaje}
          increaseLike={() => increaseLike(mensaje.id)}
          removeItem={() => removeItem(mensaje.id)}
        />
      ))}
    </ul>
  );
}
