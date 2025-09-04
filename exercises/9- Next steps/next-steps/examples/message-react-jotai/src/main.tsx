import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider as JotaiProvider } from "jotai/react";
import { store } from "./store/messageStore.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <JotaiProvider store={store}>
      <App />
    </JotaiProvider>
  </StrictMode>
);
