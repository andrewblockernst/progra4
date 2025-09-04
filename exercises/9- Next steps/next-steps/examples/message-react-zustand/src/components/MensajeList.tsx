import { useMessageStore } from "../store/messageStore";

export const MensajeList = () => {
  const messages = useMessageStore((s) => s.messages);
  const likeMessage = useMessageStore((s) => s.likeMessage);

  if (messages.length === 0) {
    return (
      <div className="text-gray-500 text-center py-4">No hay mensajes</div>
    );
  }

  return (
    <ul className="space-y-4">
      {messages.map((mensaje) => (
        <li
          key={mensaje.id}
          className="p-4 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
        >
          <div className="flex justify-between items-start gap-4">
            <p className="flex-1">{mensaje.content}</p>
            <button
              onClick={() => likeMessage(mensaje.id)}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <span>❤️</span>
              <span>{mensaje.likes}</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
