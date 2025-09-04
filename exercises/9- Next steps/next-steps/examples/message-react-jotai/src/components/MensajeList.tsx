import { useAtomValue } from "jotai";
import { messagesAtom } from "../store/messageStore";
import { MensajeItem } from "./MensajeItem";

export function MensajeList() {
  const messages = useAtomValue(messagesAtom);

  if (messages.length === 0) {
    return <div className="text-center py-4">No hay mensajes</div>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MensajeItem key={message.id} message={message} />
      ))}
    </div>
  );
}
