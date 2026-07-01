// Cliente fino del asistente web: habla con la Netlify Function /asistente.
export type ChatMsg = { rol: "cliente" | "asistente"; texto: string };

export type CampoLite = {
  id: string;
  titulo: string;
  zona: string;
  categoria: string;
  hectareas?: number;
  aptitud?: string;
  operacion?: string;
};

export type RespuestaAsistente = {
  respuesta: string;
  camposIds: string[];
  lead: { nombre: string; contacto: string } | null;
};

export async function consultarAsistente(
  mensaje: string,
  historial: ChatMsg[],
  catalogo: CampoLite[]
): Promise<RespuestaAsistente> {
  const r = await fetch("/.netlify/functions/asistente", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ mensaje, historial, catalogo }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || "El asistente no está disponible.");
  return {
    respuesta: String(data.respuesta || ""),
    camposIds: Array.isArray(data.camposIds) ? data.camposIds : [],
    lead: data.lead && data.lead.contacto ? data.lead : null,
  };
}
