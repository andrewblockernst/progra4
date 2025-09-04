import { messagesAtom } from "../store/messageStore";
import { useAtomValue } from "jotai";

export function Stats() {
  const messages = useAtomValue(messagesAtom);
  return (
    <div className="flex flex-row justify-center gap-4">
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>Total messages: {messages.length}</p>
      </div>
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>
          Total likes: {messages.reduce((acc, curr) => acc + curr.likes, 0)}
        </p>
      </div>
    </div>
  );
}
