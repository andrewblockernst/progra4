import "./App.css";
import { FilterForm } from "./components/FilterForm";
import { NuevoMensajeForm } from "./components/NuevoMensajeForm";
import { MensajeList } from "./components/MensajeList";
import { useState } from "react";
import { useDebounce } from "./utils/useDebounce";
import { Stats } from "./components/Stats";
import { LoginForm } from "./components/LoginForm";

function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <>
      <LoginForm />
      <Stats search={debouncedSearch} />
      <section className="min-w-[50vw] flex flex-col gap-4 border border-gray-300 rounded-md p-8 m-8">
        <FilterForm search={search ?? ""} setSearch={setSearch} />
        <NuevoMensajeForm search={debouncedSearch} />
      </section>

      <MensajeList search={debouncedSearch} />
    </>
  );
}

export default App;
