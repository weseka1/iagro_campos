// ===== Modelo unificado de propiedad (público) =====
// La inmobiliaria opera campos Y urbano (casas, deptos, lotes, terrenos, locales).
// Los `campos` (data/campos.ts) se adaptan a este modelo y se suman a las urbanas.

export type Categoria =
  | "campo"
  | "casa"
  | "departamento"
  | "lote"
  | "terreno"
  | "local";

export type OperacionProp = "venta" | "alquiler" | "arrendamiento";

export interface Propiedad {
  id: string;
  categoria: Categoria;
  titulo: string;
  operacion: OperacionProp;
  precioUSD: number | null; // null = "Consultar"
  precioPorHa?: number | null;
  zona: string;
  provincia: string;
  direccion?: string;
  fotos: string[];
  descripcion: string;
  estado: "disponible" | "reservado" | "vendido";
  destacado: boolean;
  esNuevo?: boolean;
  esOportunidad?: boolean;
  // rural
  hectareas?: number;
  aptitud?: "agrícola" | "ganadera" | "mixta";
  // urbano
  ambientes?: number;
  dormitorios?: number;
  banos?: number;
  cocheras?: number;
  m2cubiertos?: number;
  m2totales?: number;
  // común
  caracteristicas: string[];
  video?: string;
  lat?: number;
  lng?: number;
}

export const CATEGORIAS: { key: Categoria; label: string; plural: string }[] = [
  { key: "campo", label: "Campo", plural: "Campos" },
  { key: "casa", label: "Casa", plural: "Casas" },
  { key: "departamento", label: "Departamento", plural: "Departamentos" },
  { key: "lote", label: "Lote", plural: "Lotes" },
  { key: "terreno", label: "Terreno", plural: "Terrenos" },
  { key: "local", label: "Local", plural: "Locales" },
];
