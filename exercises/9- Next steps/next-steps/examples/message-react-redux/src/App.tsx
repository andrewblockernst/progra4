import "./App.css";
import { FilterForm } from "./components/FilterForm";
import { NuevoMensajeForm } from "./components/NuevoMensajeForm";
import { MensajeList } from "./components/MensajeList";
import { useEffect, useState } from "react";
import { useDebounce } from "./utils/useDebounce";
import { Stats } from "./components/Stats";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchMessages } from "./store/messageSlice";

function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector(
    (state) => state.messages
  );

  // Initial fetch but also filter by search
  useEffect(() => {
    dispatch(fetchMessages(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <Stats mensajes={messages} />
      <section className="min-w-[50vw] flex flex-col gap-4 border border-gray-300 rounded-md p-8 m-8">
        <FilterForm search={search ?? ""} setSearch={setSearch} />
        <NuevoMensajeForm />
      </section>

      {loading ? <div>Loading...</div> : <MensajeList mensajes={messages} />}
    </>
  );
}

export default App;
