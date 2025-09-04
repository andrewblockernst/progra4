import { useMessageStore } from "../store/messageStore";

export const FilterForm = () => {
  const search = useMessageStore((s) => s.search);
  const setSearch = useMessageStore((s) => s.setSearch);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="search" className="text-sm font-medium text-gray-700">
        Buscar mensajes
      </label>
      <input
        type="text"
        id="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar mensajes..."
      />
    </div>
  );
};
