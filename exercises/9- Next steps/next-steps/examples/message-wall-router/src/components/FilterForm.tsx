type FilterFormProps = {
  search: string;
  setSearch: (value: string) => void;
};

export function FilterForm({ search, setSearch }: FilterFormProps) {
  return (
    <form action="/" className="flex w-full justify-between gap-2">
      <input
        className="border border-gray-300 rounded-md p-2 flex-1"
        type="text"
        name="search"
        placeholder="Texto a buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
    </form>
  );
}
