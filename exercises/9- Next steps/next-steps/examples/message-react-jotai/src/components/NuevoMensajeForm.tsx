import { useState } from "react";
import { useSetAtom } from "jotai";
import { addMessageAtom } from "../store/messageStore";

export function NuevoMensajeForm() {
  const [content, setContent] = useState("");
  const addMessage = useSetAtom(addMessageAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addMessage(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe un nuevo mensaje..."
        className="w-full p-2 border rounded"
        rows={3}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Enviar
      </button>
    </form>
  );
}
