import { useAppDispatch } from "../store/hooks";
import { deleteMessage, likeMessage } from "../store/messageSlice";
import type { Mensaje } from "../types";
import { MensajeItem } from "./MensajeItem";

export function MensajeList({ mensajes }: { mensajes: Mensaje[] }) {
  const dispatch = useAppDispatch();

  const increaseLike = async (id: string) => {
    await dispatch(likeMessage(id));
  };

  const removeItem = async (id: string) => {
    await dispatch(deleteMessage(id));
  };
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
