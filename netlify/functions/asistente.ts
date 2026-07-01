import Anthropic from "@anthropic-ai/sdk";
import { CONFIG } from "./_config";
import { buildSystem, type CampoLite } from "./_prompt";

// Structured output: la IA responde SIEMPRE este JSON (Haiku 4.5 soporta structured outputs).
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["respuesta", "campos_ids", "lead_nombre", "lead_contacto"],
  properties: {
    respuesta: { type: "string", description: "Lo que le decís al visitante (2-4 oraciones)." },
    campos_ids: {
      type: "array",
      items: { type: "string" },
      description: "IDs de campos del catálogo a recomendar (0 a 3).",
    },
    lead_nombre: { type: "string", description: "Nombre si lo dio, si no cadena vacía." },
    lead_contacto: { type: "string", description: "Teléfono o email si lo dio, si no cadena vacía." },
  },
} as const;

function json(obj: unknown, status = 200): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Extrae el primer objeto JSON válido de la respuesta del modelo (tolera fences o texto extra/cortado).
function extractJson(text: string): any {
  if (!text) return null;
  let t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try { return JSON.parse(t); } catch { /* seguimos intentando */ }
  const i = t.indexOf("{");
  const j = t.lastIndexOf("}");
  if (i >= 0 && j > i) {
    try { return JSON.parse(t.slice(i, j + 1)); } catch { /* nada */ }
  }
  return null;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: "El asistente no está configurado (falta ANTHROPIC_API_KEY)." }, 503);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido." }, 400);
  }

  const mensaje = String(body?.mensaje ?? "").trim().slice(0, 2000);
  if (!mensaje) return json({ error: "Mensaje vacío." }, 400);

  const historial = Array.isArray(body?.historial) ? body.historial.slice(-12) : [];
  const catalogo: CampoLite[] = Array.isArray(body?.catalogo) ? body.catalogo.slice(0, 60) : [];

  const messages = [
    ...historial
      .map((m: any) => ({
        role: (m?.rol === "asistente" ? "assistant" : "user") as "assistant" | "user",
        content: String(m?.texto ?? "").slice(0, 2000),
      }))
      .filter((m: any) => m.content),
    { role: "user" as const, content: mensaje },
  ];

  const client = new Anthropic({ apiKey });

  try {
    const resp = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: buildSystem(CONFIG, catalogo),
      messages,
      // structured outputs (cuando aplica) + el formato JSON también va explícito en el prompt
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
    } as any);

    const text = (resp.content.find((b: any) => b.type === "text") as any)?.text ?? "";
    const data = extractJson(text) ?? {};

    const respuesta =
      String(data?.respuesta ?? "").trim() ||
      "Perdón, no te entendí bien. ¿Me lo repetís? Contame qué buscás (un campo, una casa, un depto…) y en qué zona.";
    const camposIds = Array.isArray(data?.campos_ids) ? data.campos_ids.map(String).slice(0, 3) : [];
    const contacto = String(data?.lead_contacto ?? "").trim();
    const lead = contacto ? { nombre: String(data?.lead_nombre ?? "").trim(), contacto } : null;

    return json({ respuesta, camposIds, lead });
  } catch (e: any) {
    return json({ error: "El asistente no está disponible en este momento.", detail: String(e?.message ?? e) }, 502);
  }
};
