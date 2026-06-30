import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ImagePlus, Video, X, Loader2, Check, Sparkles, MapPin, Home as HomeIcon, Sprout } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import { useToast } from "../components/Toast";
import { PageHeader } from "../components/PageShell";
import { supabase } from "@/lib/supabase";
import type { Propiedad, Categoria } from "@/data/propiedadTypes";

const categorias: { v: Categoria; l: string }[] = [
  { v: "campo", l: "Campo" }, { v: "casa", l: "Casa" }, { v: "departamento", l: "Departamento" },
  { v: "lote", l: "Lote" }, { v: "terreno", l: "Terreno" }, { v: "local", l: "Local" },
];

export default function CargarPropiedad() {
  const { addPropiedad } = useData();
  const { push } = useToast();
  const navigate = useNavigate();

  const [f, setF] = useState<any>({
    categoria: "campo", operacion: "venta", titulo: "", zona: "", provincia: "Buenos Aires",
    direccion: "", precioUSD: "", precioPorHa: "", hectareas: "", aptitud: "agrícola",
    ambientes: "", dormitorios: "", banos: "", cocheras: "", m2cubiertos: "", m2totales: "",
    descripcion: "", caracteristicas: "", estado: "disponible", destacado: false, esNuevo: true, esOportunidad: false,
    video: "",
  });
  const [fotos, setFotos] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const set = (k: string, v: any) => setF((p: any) => ({ ...p, [k]: v }));
  const esCampo = f.categoria === "campo";

  const subirFotos = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setSubiendo(true);
    for (const file of Array.from(files)) {
      try {
        if (supabase) {
          const path = `props/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
          const { error } = await supabase.storage.from("iagro").upload(path, file, { upsert: true });
          if (!error) {
            const url = supabase.storage.from("iagro").getPublicUrl(path).data.publicUrl;
            setFotos((p) => [...p, url]);
            continue;
          }
        }
        // fallback offline: preview local en sesión
        setFotos((p) => [...p, URL.createObjectURL(file)]);
      } catch {
        setFotos((p) => [...p, URL.createObjectURL(file)]);
      }
    }
    setSubiendo(false);
    push("Fotos subidas ✓", "success");
  };

  const num = (v: any) => (v === "" || v == null ? undefined : Number(v));

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.titulo || !f.zona) {
      push("Completá al menos título y zona", "info");
      return;
    }
    const p: Propiedad = {
      id: "PROP-" + Date.now(),
      categoria: f.categoria,
      titulo: f.titulo,
      operacion: f.operacion,
      precioUSD: num(f.precioUSD) ?? null,
      precioPorHa: esCampo ? num(f.precioPorHa) ?? null : null,
      zona: f.zona,
      provincia: f.provincia,
      direccion: f.direccion || undefined,
      fotos: fotos.length ? fotos : ["/img/campos/u1.jpg"],
      descripcion: f.descripcion,
      estado: f.estado,
      destacado: f.destacado,
      esNuevo: f.esNuevo,
      esOportunidad: f.esOportunidad,
      hectareas: esCampo ? num(f.hectareas) : undefined,
      aptitud: esCampo ? f.aptitud : undefined,
      ambientes: !esCampo ? num(f.ambientes) : undefined,
      dormitorios: !esCampo ? num(f.dormitorios) : undefined,
      banos: !esCampo ? num(f.banos) : undefined,
      cocheras: !esCampo ? num(f.cocheras) : undefined,
      m2cubiertos: !esCampo ? num(f.m2cubiertos) : undefined,
      m2totales: !esCampo ? num(f.m2totales) : undefined,
      caracteristicas: f.caracteristicas ? f.caracteristicas.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      video: f.video?.trim() || undefined,
    };
    await addPropiedad(p);
    setGuardado(true);
    push("Propiedad publicada ✓ — ya está en la web", "success");
    setTimeout(() => navigate("/panel/cartera"), 1400);
  };

  if (guardado) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="pcard max-w-md p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-iagro/15 text-iagro-400"><Check size={32} /></span>
          <h2 className="mt-5 font-display text-2xl text-graph">¡Propiedad publicada!</h2>
          <p className="mt-2 text-sm text-graph-400">Ya quedó guardada y visible en la web. Te llevo a la cartera…</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={guardar}>
      <PageHeader
        title="Cargar propiedad"
        subtitle="Subí fotos, video y todos los datos. Al publicar, aparece automáticamente en la web."
        actions={
          <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-xl bg-iagro px-5 text-sm font-semibold text-graph transition hover:bg-iagro-600">
            <UploadCloud size={16} /> Publicar propiedad
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ===== Columna izquierda: datos ===== */}
        <div className="space-y-6">
          {/* Básicos */}
          <section className="pcard p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-graph"><HomeIcon size={16} className="text-iagro" /> Datos principales</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Tipo de propiedad"><Sel value={f.categoria} onChange={(v) => set("categoria", v)} opts={categorias.map((c) => ({ v: c.v, l: c.l }))} /></Campo>
              <Campo label="Operación"><Sel value={f.operacion} onChange={(v) => set("operacion", v)} opts={[{ v: "venta", l: "Venta" }, { v: "alquiler", l: "Alquiler" }, { v: "arrendamiento", l: "Arrendamiento" }]} /></Campo>
              <Campo label="Título" full><Inp value={f.titulo} onChange={(v) => set("titulo", v)} ph="Ej: Campo agrícola 800 ha — Coronel Suárez" /></Campo>
              <Campo label="Zona / Localidad"><Inp value={f.zona} onChange={(v) => set("zona", v)} ph="Bahía Blanca" /></Campo>
              <Campo label="Dirección (opcional)"><Inp value={f.direccion} onChange={(v) => set("direccion", v)} ph="Av. Alem 703" /></Campo>
              <Campo label="Precio (U$S) — dejalo vacío para mostrar “A consultar”"><Inp value={f.precioUSD} onChange={(v) => set("precioUSD", v)} ph="vacío = A consultar" type="number" /></Campo>
              {esCampo && <Campo label="Precio por hectárea (U$S)"><Inp value={f.precioPorHa} onChange={(v) => set("precioPorHa", v)} ph="3500" type="number" /></Campo>}
            </div>
          </section>

          {/* Atributos según tipo */}
          <section className="pcard p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-semibold text-graph">
              {esCampo ? <Sprout size={16} className="text-iagro" /> : <MapPin size={16} className="text-iagro" />} Características
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {esCampo ? (
                <>
                  <Campo label="Hectáreas"><Inp value={f.hectareas} onChange={(v) => set("hectareas", v)} ph="800" type="number" /></Campo>
                  <Campo label="Aptitud"><Sel value={f.aptitud} onChange={(v) => set("aptitud", v)} opts={[{ v: "agrícola", l: "Agrícola" }, { v: "ganadera", l: "Ganadera" }, { v: "mixta", l: "Mixta" }]} /></Campo>
                </>
              ) : (
                <>
                  <Campo label="Ambientes"><Inp value={f.ambientes} onChange={(v) => set("ambientes", v)} ph="3" type="number" /></Campo>
                  <Campo label="Dormitorios"><Inp value={f.dormitorios} onChange={(v) => set("dormitorios", v)} ph="2" type="number" /></Campo>
                  <Campo label="Baños"><Inp value={f.banos} onChange={(v) => set("banos", v)} ph="1" type="number" /></Campo>
                  <Campo label="Cocheras"><Inp value={f.cocheras} onChange={(v) => set("cocheras", v)} ph="1" type="number" /></Campo>
                  <Campo label="M² cubiertos"><Inp value={f.m2cubiertos} onChange={(v) => set("m2cubiertos", v)} ph="120" type="number" /></Campo>
                  <Campo label="M² totales"><Inp value={f.m2totales} onChange={(v) => set("m2totales", v)} ph="300" type="number" /></Campo>
                </>
              )}
            </div>
            <div className="mt-4">
              <Campo label="Características (separá con comas)" full><Inp value={f.caracteristicas} onChange={(v) => set("caracteristicas", v)} ph="Cochera, Patio, Parrilla, Apto crédito" /></Campo>
            </div>
          </section>

          {/* Descripción */}
          <section className="pcard p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-graph">Descripción</h3>
            <textarea
              value={f.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              rows={5}
              placeholder="Describí la propiedad: ubicación, estado, oportunidad, mejoras…"
              className="w-full rounded-xl border border-graph/10 bg-graph/[0.04] p-3 text-sm text-graph outline-none transition placeholder:text-graph-400 focus:border-iagro/60"
            />
          </section>
        </div>

        {/* ===== Columna derecha: media + flags ===== */}
        <div className="space-y-6">
          {/* Fotos */}
          <section className="pcard p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-graph"><ImagePlus size={16} className="text-iagro" /> Fotos</h3>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-graph/15 bg-graph/[0.02] py-8 text-center transition hover:border-iagro/50 hover:bg-graph/[0.04]">
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => subirFotos(e.target.files)} />
              {subiendo ? <Loader2 size={24} className="animate-spin text-iagro" /> : <UploadCloud size={24} className="text-graph-400" />}
              <span className="text-sm font-medium text-graph-500">{subiendo ? "Subiendo…" : "Arrastrá o hacé clic para subir"}</span>
              <span className="text-xs text-graph-400">JPG, PNG — varias a la vez</span>
            </label>
            {fotos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {fotos.map((src, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-lg ring-1 ring-graph/10">
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                    <button type="button" onClick={() => setFotos((p) => p.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-graph/80 text-graph opacity-0 transition group-hover:opacity-100">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Video */}
          <section className="pcard p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-graph"><Video size={16} className="text-iagro" /> Video (opcional)</h3>
            <Inp value={f.video} onChange={(v) => set("video", v)} ph="Link de YouTube / drone / recorrido" />
            <p className="mt-2 text-xs text-graph-400">Pegá el link del video del campo (YouTube, Vimeo o MP4).</p>
          </section>

          {/* Flags */}
          <section className="pcard p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-graph">Publicación</h3>
            <div className="space-y-2.5">
              <Toggle label="Destacar en portada" v={f.destacado} on={() => set("destacado", !f.destacado)} />
              <Toggle label="Marcar como NUEVO" v={f.esNuevo} on={() => set("esNuevo", !f.esNuevo)} />
              <Toggle label="Marcar como OPORTUNIDAD" v={f.esOportunidad} on={() => set("esOportunidad", !f.esOportunidad)} />
            </div>
            <div className="mt-4 rounded-xl border border-iagro/20 bg-iagro/[0.06] p-3 text-xs text-graph-500">
              <Sparkles size={13} className="mb-1 inline text-iagro" /> Al publicar, la propiedad queda visible en la web y en el buscador del sitio al instante.
            </div>
            <button type="submit" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-iagro text-sm font-semibold text-graph transition hover:bg-iagro-600">
              <UploadCloud size={16} /> Publicar propiedad
            </button>
          </section>
        </div>
      </div>
    </form>
  );
}

// ----- piezas de formulario -----
function Campo({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-full" : ""}`}>
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest2 text-graph-400">{label}</span>
      {children}
    </label>
  );
}
function Inp({ value, onChange, ph, type = "text" }: { value: any; onChange: (v: string) => void; ph?: string; type?: string }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph} className="h-10 w-full rounded-xl border border-graph/10 bg-graph/[0.04] px-3 text-sm text-graph placeholder:text-graph-400 outline-none transition focus:border-iagro/60" />;
}
function Sel({ value, onChange, opts }: { value: string; onChange: (v: string) => void; opts: { v: string; l: string }[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full rounded-xl border border-graph/10 bg-graph/[0.04] px-3 text-sm text-graph outline-none transition focus:border-iagro/60">
      {opts.map((o) => <option key={o.v} value={o.v} className="bg-paper-100 text-graph">{o.l}</option>)}
    </select>
  );
}
function Toggle({ label, v, on }: { label: string; v: boolean; on: () => void }) {
  return (
    <button type="button" onClick={on} className="flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-sm text-graph">
      <span>{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition ${v ? "bg-iagro" : "bg-graph/15"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${v ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
