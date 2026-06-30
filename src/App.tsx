import { Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense, type ReactNode } from "react";
import Home from "./site/Home";
import Catalogo from "./site/Catalogo";
import PropiedadDetalle from "./site/PropiedadDetalle";
import Favoritos from "./site/Favoritos";
import Cuenta from "./site/Cuenta";
import { AuthProvider } from "./site/context/AuthContext";
import { FavoritesProvider } from "./site/context/FavoritesContext";
import { DataProvider } from "./lib/DataProvider";

import { PanelAuthProvider, usePanelAuth } from "./panel/auth";
import Login from "./panel/Login";

// El panel (con recharts) se carga solo cuando se entra a /panel.
const PanelApp = lazy(() => import("./panel/PanelApp"));

// Protege el panel: sin sesión → a la pantalla de login.
function RequirePanelAuth({ children }: { children: ReactNode }) {
  const { authed, loading } = usePanelAuth();
  if (loading) return <PanelFallback />;
  return authed ? <>{children}</> : <Navigate to="/ingresar" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RedirectCampo() {
  const { id } = useParams();
  return <Navigate to={`/propiedad/${id}`} replace />;
}

function PanelFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F6F2E9", color: "#11100B", fontFamily: "Inter, sans-serif" }}>
      Cargando panel…
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
    <AuthProvider>
      <FavoritesProvider>
      <PanelAuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/propiedades" element={<Catalogo />} />
          <Route path="/propiedad/:id" element={<PropiedadDetalle />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/cuenta" element={<Cuenta />} />
          {/* compatibilidad con rutas viejas */}
          <Route path="/campos" element={<Navigate to="/propiedades?cat=campo" replace />} />
          <Route path="/campo/:id" element={<RedirectCampo />} />
          <Route path="/ingresar" element={<Login />} />
          <Route
            path="/panel/*"
            element={
              <RequirePanelAuth>
                <Suspense fallback={<PanelFallback />}>
                  <PanelApp />
                </Suspense>
              </RequirePanelAuth>
            }
          />
          {/* /admin es alias del panel; cualquier ruta desconocida vuelve al home (sin pantallas en blanco) */}
          <Route path="/admin/*" element={<Navigate to="/panel" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PanelAuthProvider>
      </FavoritesProvider>
    </AuthProvider>
    </DataProvider>
  );
}
