import type { Mensaje } from "../types";

type MensajeItemProps = {
  mensaje: Mensaje;
  increaseLike: () => void;
  removeItem: () => void;
};

export function MensajeItem({
  mensaje: { id, content, likes },
  increaseLike,
  removeItem,
}: MensajeItemProps) {
  return (
    <li
      data-id={id}
      className="w-full flex justify-between border border-gray-300 rounded-md p-2"
    >
      <p data-content="content" className="flex-1 text-left text-xl">
        {content}
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="like"
        type="submit"
        onClick={increaseLike}
      >
        {likes} Like{likes !== 1 ? "s" : ""}
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white rounded-md p-2 cursor-pointer"
        name="action"
        value="delete"
        type="submit"
        onClick={removeItem}
      >
        Eliminar
      </button>
    </li>
  );
}
