import type { Mensaje } from "../types";

export function Stats({ mensajes }: { mensajes: Mensaje[] }) {
  return (
    <div className="flex flex-row justify-center gap-4">
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>Total messages: {mensajes.length}</p>
      </div>
      <div className="flex gap-2 border border-gray-300 p-4 rounded-md">
        <p>
          Total likes: {mensajes.reduce((acc, curr) => acc + curr.likes, 0)}
        </p>
      </div>
    </div>
  );
}
