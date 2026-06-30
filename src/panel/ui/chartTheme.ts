// Paleta de marca para charts (recharts) — tema CLARO premium (flow Apple).
export const COLORS = {
  ink: "#171A17", // grafito (tinta)
  bone: "#171A17", // alias: cualquier texto que usaba "bone" ahora es grafito
  wheat: "#C9A24E",
  wheat400: "#D8B566",
  field: "#2E7D52", // verde IAGRO (un solo verde de marca)
  field300: "#3D9A67",
  clay: "#9C6B3C",
  // grilla y ejes sobre fondo claro
  grid: "rgba(23,26,23,0.07)",
  axis: "rgba(23,26,23,0.45)",
  // alias compatibilidad
  ink10: "rgba(23,26,23,0.08)",
  ink60: "rgba(23,26,23,0.55)",
};

// Secuencia para series categóricas (torta/donut) — verde de marca al frente, buen contraste en claro.
export const SERIE = ["#2E7D52", "#C9A24E", "#9C6B3C", "#3D9A67", "#5B6B43", "#D8B566"];

// Tooltip claro premium reutilizable.
export const tooltipStyle = {
  background: "rgba(255,255,255,0.96)",
  border: "1px solid rgba(23,26,23,0.10)",
  borderRadius: 12,
  boxShadow: "0 18px 44px -20px rgba(23,26,23,0.28)",
  fontSize: 12,
  padding: "8px 12px",
  color: "#171A17",
  backdropFilter: "blur(8px)",
} as const;

export const tooltipItemStyle = { color: "#171A17" } as const;
export const tooltipLabelStyle = { color: "rgba(23,26,23,0.55)", marginBottom: 2 } as const;
