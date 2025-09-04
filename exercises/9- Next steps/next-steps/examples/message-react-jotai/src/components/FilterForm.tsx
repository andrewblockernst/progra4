import { useAtom } from "jotai";
import { searchAtom } from "../store/messageStore";

export function FilterForm() {
  const [search, setSearch] = useAtom(searchAtom);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar mensajes..."
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
