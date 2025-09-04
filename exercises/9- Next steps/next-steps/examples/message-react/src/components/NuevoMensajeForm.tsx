import type { FormEvent } from "react";

type NuevoMensajeFormProps = {
  addMensaje: (content: string) => void;
};

export function NuevoMensajeForm({ addMensaje }: NuevoMensajeFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const content = formData.get("content")?.toString();

    if (!content) {
      return alert("Completa el formulario, boludo.");
    }

    addMensaje(content);
    target.reset();
  }

  return (
    <form
      action="/api/mensajes"
      method="post"
      className="flex w-full justify-between gap-2"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-gray-300 rounded-md p-2 flex-1"
        type="text"
        name="content"
        placeholder="Contenido del mensaje"
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 cursor-pointer"
        type="submit"
      >
        Guardar
      </button>
    </form>
  );
}
