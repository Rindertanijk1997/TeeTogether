import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // Importera AuthProvider
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Ingen root-element hittades!");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
