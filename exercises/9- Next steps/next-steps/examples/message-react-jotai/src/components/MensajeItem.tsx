import { useSetAtom } from "jotai";
import type { Mensaje } from "../types";
import { likeMessageAtom } from "../store/messageStore";

type MensajeItemProps = {
  message: Mensaje;
};

export function MensajeItem({ message }: MensajeItemProps) {
  const likeMessage = useSetAtom(likeMessageAtom);

  return (
    <div className="border rounded p-4 space-y-2">
      <p className="text-white">{message.content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{new Date(message.createdAt).toLocaleString()}</span>
        <button
          onClick={() => likeMessage(message.id)}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <span>❤️</span>
          <span>{message.likes}</span>
        </button>
      </div>
    </div>
  );
}
