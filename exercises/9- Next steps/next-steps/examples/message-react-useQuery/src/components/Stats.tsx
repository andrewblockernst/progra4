import { useMensajes } from "../hooks/useMensajes";

export function Stats({ search }: { search: string }) {
  const { data: mensajes } = useMensajes(search);

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
