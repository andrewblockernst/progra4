import "./App.css";
import { FilterForm } from "./components/FilterForm";
import { NuevoMensajeForm } from "./components/NuevoMensajeForm";
import { MensajeList } from "./components/MensajeList";
import { useAtomValue } from "jotai";
import { loadingAtom, errorAtom } from "./store/messageStore";
import { Stats } from "./components/Stats";

function App() {
  const loading = useAtomValue(loadingAtom);
  const error = useAtomValue(errorAtom);

  return (
    <>
      <section className="min-w-[50vw] flex flex-col gap-4 border border-gray-300 rounded-md p-8 m-8">
        <Stats />
        <FilterForm />
        <NuevoMensajeForm />
      </section>
      {error && <div className="text-red-500 p-4">Error: {error}</div>}
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Mensajes</h1>
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-4">Cargando...</div>
          ) : (
            <MensajeList />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
