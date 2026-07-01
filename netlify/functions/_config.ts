// ── Config del cliente (el "molde" replicable) ────────────────────────────────
// Para clonar el asistente a otro cliente: copiá este archivo y cambiá estos valores.
// El resto del código (prompt + function + widget) es genérico y no se toca.

export type AsistenteConfig = {
  negocio: string;        // nombre comercial
  rubro: string;          // qué hace, en una frase
  zona: string;           // zona de trabajo
  desde?: string;         // año de fundación (opcional)
  asistente: string;      // nombre de la asesora virtual
  itemSingular: string;   // "campo" | "auto" | "propiedad" | "turno"…
  itemPlural: string;     // "campos" | "autos"…
  saludo: string;         // primer mensaje que ve el visitante
};

export const CONFIG: AsistenteConfig = {
  negocio: "IAGRO Campos",
  rubro:
    "inmobiliaria de Bahía Blanca: campos, chacras y estancias, y también propiedades urbanas (casas, departamentos, lotes, terrenos y locales), en venta, alquiler y arrendamiento",
  zona: "Bahía Blanca y el sudoeste bonaerense",
  desde: "1989",
  asistente: "Aldana",
  itemSingular: "propiedad",
  itemPlural: "propiedades",
  saludo:
    "¡Hola! Soy Aldana, de IAGRO Campos. ¿Qué estás buscando? Un campo, una casa, un depto, un lote… Contame zona y qué necesitás y te muestro opciones. 🌾",
};
