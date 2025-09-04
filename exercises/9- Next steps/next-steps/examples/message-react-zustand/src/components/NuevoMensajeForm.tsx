import { useState } from "react";
import { useMessageStore } from "../store/messageStore";

export const NuevoMensajeForm = () => {
  const [content, setContent] = useState("");
  const addMessage = useMessageStore((s) => s.addMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addMessage(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="message" className="text-sm font-medium text-gray-700">
        Nuevo mensaje
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          id="message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe un mensaje..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};
