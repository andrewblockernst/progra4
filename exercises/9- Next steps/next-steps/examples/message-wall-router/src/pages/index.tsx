import { useState } from "react";
import { FilterForm } from "../components/FilterForm";

import { MensajeList } from "../components/MensajeList";
import { NuevoMensajeForm } from "../components/NuevoMensajeForm";
import { Stats } from "../components/Stats";
import { useDebounce } from "../utils/useDebounce";

export function Index() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  return (
    <>
      <Stats search={debouncedSearch} />
      <section className="min-w-[50vw] flex flex-col gap-4 border border-gray-300 rounded-md p-8 m-8">
        <FilterForm search={search ?? ""} setSearch={setSearch} />
        <NuevoMensajeForm search={debouncedSearch} />
      </section>

      <MensajeList search={debouncedSearch} />
    </>
  );
}
