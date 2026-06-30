import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// HashRouter (rutas con #/): cada ruta la sirve la raíz index.html, que SIEMPRE existe.
// Así el hosting estático no necesita rewrite de SPA (entrar directo a /#/panel nunca da pantalla en blanco).
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
