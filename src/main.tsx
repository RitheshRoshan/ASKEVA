import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initializeMockApi } from "./services/apiMock";
import { ToastProvider } from "./components/Toast";

// Initialize client-side REST mock layer
initializeMockApi();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);
