import { useMensajes } from "../hooks/useMensajes";
import { MensajeItem } from "./MensajeItem";

type MensajeItemProps = {
  search: string;
};

export function MensajeList({ search }: MensajeItemProps) {
  const { data: mensajes } = useMensajes(search);

  return (
    <ul id="message-list" className="flex flex-col gap-2 w-full">
      {mensajes.map((mensaje) => (
        <MensajeItem key={mensaje.id} mensaje={mensaje} search={search} />
      ))}
    </ul>
  );
}
