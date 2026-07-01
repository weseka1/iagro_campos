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
  rubro: "inmobiliaria rural especializada en venta y arrendamiento de campos, chacras y estancias",
  zona: "Bahía Blanca y el sudoeste bonaerense",
  desde: "1989",
  asistente: "Aldana",
  itemSingular: "campo",
  itemPlural: "campos",
  saludo:
    "¡Hola! Soy Aldana, de IAGRO Campos. Contame qué campo estás buscando —zona, hectáreas, si es para agricultura o ganadería— y te muestro opciones.",
};
