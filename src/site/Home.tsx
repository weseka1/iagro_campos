import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown, Search, Landmark, FileSearch, TrendingUp, Handshake, ArrowRight,
  ShieldCheck, MapPin, Phone, Mail, Clock, Sprout, Home as HomeIcon, Building2, Trees,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PropiedadCard from "./components/PropiedadCard";
import { useLenis } from "./lib/useLenis";
import { useReveal } from "@/lib/hooks";
import { useData } from "@/lib/DataProvider";
import { fmtHa } from "@/lib/format";

const WHATSAPP = "https://wa.me/5492915512515";
const HERO_POSTER = "/img/campos/u1.jpg"; // poster del video (fallback)

const categoriasHome = [
  { key: "campo", label: "Campos", icon: Sprout, img: "/img/campos/u9.jpg" },
  { key: "casa", label: "Casas", icon: HomeIcon, img: "/img/props/casa1.jpg" },
  { key: "departamento", label: "Departamentos", icon: Building2, img: "/img/props/depto1.jpg" },
  { key: "lote", label: "Lotes y terrenos", icon: Trees, img: "/img/props/lote1.jpg" },
];

export default function Home() {
  useLenis();
  useReveal();
  const navigate = useNavigate();
  const { propiedades, addLead } = useData();
  const zonas = [...new Set(propiedades.map((c) => c.zona))].sort();
  const destacados = propiedades.filter((p) => p.destacado).slice(0, 6);
  const countByCat = (cat: string) => propiedades.filter((p) => p.categoria === cat).length;
  const [q, setQ] = useState({ cat: "", zona: "", operacion: "" });

  const buscar = () => {
    const p = new URLSearchParams();
    if (q.cat) p.set("cat", q.cat);
    if (q.zona) p.set("zona", q.zona);
    if (q.operacion) p.set("operacion", q.operacion);
    navigate(`/propiedades?${p.toString()}`);
  };

  return (
    <div className="bg-paper text-graph">
      <div className="grain" />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-paper">
        <div className="absolute inset-0">
          <video
            autoPlay muted loop playsInline poster={HERO_POSTER}
            className="h-full w-full object-cover"
            aria-hidden
          >
            <source src="/video/hero.webm" type="video/webm" />
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          {/* velo blanco: legibilidad a la izquierda, video respirando a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/40" />
        </div>

        <div className="container-x relative z-10 pt-28">
          <div className="max-w-3xl">
            <p className="eyebrow reveal flex items-center gap-2">
              <span className="h-px w-8 bg-iagro" /> Inmobiliaria en Bahía Blanca · desde 1989
            </p>
            <h1 className="reveal mt-6 font-display text-5xl font-medium leading-[1.04] tracking-tight text-graph sm:text-6xl md:text-7xl">
              Campos, casas y <br />
              <span className="text-iagro">propiedades</span> con quien <br />
              conoce la zona.
            </h1>
            <p className="reveal mt-7 max-w-xl text-lg leading-relaxed text-graph-500" data-delay="120ms">
              35 años conectando a la gente con la tierra y el hogar correcto en Bahía
              Blanca y el sudoeste bonaerense.{" "}
              <span className="font-medium text-graph">La esquina de los buenos negocios.</span>
            </p>
            <div className="reveal mt-9 flex flex-wrap gap-4" data-delay="220ms">
              <Link to="/propiedades" className="btn-primary">Ver propiedades <ArrowRight size={16} /></Link>
              <a href="#tasaciones" className="btn-ghost">Tasá tu propiedad</a>
            </div>
          </div>
        </div>

        {/* Buscador flotante */}
        <div className="container-x absolute inset-x-0 bottom-8 z-10">
          <div className="reveal rounded-2xl border border-graph/10 bg-paper-100/80 p-4 shadow-card backdrop-blur-md md:p-5" data-delay="320ms">
            <div className="grid gap-3 md:grid-cols-[1.2fr_1.3fr_1fr_auto]">
              <Select label="Tipo" value={q.cat} onChange={(v) => setQ({ ...q, cat: v })}
                options={[{ v: "campo", l: "Campos" }, { v: "casa", l: "Casas" }, { v: "departamento", l: "Departamentos" }, { v: "lote", l: "Lotes" }]} placeholder="Todos" />
              <Select label="Zona" value={q.zona} onChange={(v) => setQ({ ...q, zona: v })} options={zonas.map((z) => ({ v: z, l: z }))} placeholder="Todas las zonas" />
              <Select label="Operación" value={q.operacion} onChange={(v) => setQ({ ...q, operacion: v })}
                options={[{ v: "venta", l: "Venta" }, { v: "alquiler", l: "Alquiler" }, { v: "arrendamiento", l: "Arrendamiento" }]} placeholder="Todas" />
              <button onClick={buscar} className="btn-primary h-[58px] self-end"><Search size={16} /> Buscar</button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 animate-bounce text-graph-400"><ChevronDown /></div>
      </section>

      {/* ===== TRAYECTORIA ===== */}
      <section className="border-y border-graph/10 bg-paper-100">
        <div className="container-x grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
          {[
            { n: "1989", l: "Año de fundación" },
            { n: "+500", l: "Operaciones cerradas" },
            { n: `${propiedades.length}`, l: "Propiedades en cartera" },
            { n: fmtHa(propiedades.reduce((a, p) => a + (p.hectareas ?? 0), 0)), l: "Hectáreas en cartera" },
          ].map((s, i) => (
            <div key={i} className="reveal text-center md:text-left" data-delay={`${i * 80}ms`}>
              <p className="font-display text-3xl font-semibold tracking-tight text-iagro md:text-4xl">{s.n}</p>
              <p className="mt-1 text-sm text-graph-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section className="py-24">
        <div className="container-x">
          <div className="reveal mb-12">
            <p className="eyebrow">Explorá por tipo</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-graph md:text-5xl">¿Qué estás buscando?</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categoriasHome.map((c, i) => (
              <Link key={c.key} to={`/propiedades?cat=${c.key}`} className="reveal group relative h-56 overflow-hidden rounded-2xl" data-delay={`${i * 70}ms`}>
                <img src={c.img} alt={c.label} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-graph via-graph/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <c.icon size={22} className="text-white" />
                  <h3 className="mt-2 font-display text-xl font-semibold text-white">{c.label}</h3>
                  <p className="text-sm text-white/70">{countByCat(c.key)} propiedades</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTACADOS ===== */}
      <section className="border-t border-graph/10 bg-paper-100 py-24">
        <div className="container-x">
          <div className="reveal mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Oportunidades</p>
              <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-graph md:text-5xl">Propiedades destacadas</h2>
            </div>
            <Link to="/propiedades" className="group flex items-center gap-2 text-sm font-semibold text-iagro">
              Ver todo el catálogo <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p) => (
              <div key={p.id} className="reveal"><PropiedadCard p={p} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="border-t border-graph/10 py-24">
        <div className="container-x">
          <div className="reveal mb-14 max-w-2xl">
            <p className="eyebrow">Lo que hacemos</p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-graph md:text-5xl">Todo el negocio inmobiliario, en un solo lugar</h2>
            <p className="mt-5 text-lg text-graph-500">Acompañamos cada operación de principio a fin, con el conocimiento de la zona y el respaldo de tres décadas.</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl bg-graph/10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Landmark, t: "Venta y alquiler", d: "Campos, casas, departamentos y lotes en Bahía Blanca y toda la zona." },
              { icon: Handshake, t: "Arrendamientos", d: "Contratos de arrendamiento rural y alquileres urbanos, con seguimiento." },
              { icon: FileSearch, t: "Tasaciones", d: "Valuación profesional para venta, garantía o sucesión, con informe escrito." },
              { icon: TrendingUp, t: "Asesoramiento", d: "Inversión en inmuebles y tierra como reserva de valor: te ayudamos a elegir." },
            ].map((s, i) => (
              <div key={i} className="reveal group bg-paper-100 p-8 transition hover:bg-paper-200" data-delay={`${i * 80}ms`}>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-iagro-50 text-iagro transition group-hover:bg-iagro group-hover:text-white"><s.icon size={22} /></span>
                <h3 className="mt-6 font-display text-xl font-semibold text-graph">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-graph-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TASACIONES ===== */}
      <section id="tasaciones" className="relative overflow-hidden py-28">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url(/img/campos/u14.jpg)" }} />
          <div className="absolute inset-0 bg-paper/90" />
        </div>
        <div className="container-x relative z-10">
          <div className="max-w-2xl">
            <p className="eyebrow reveal flex items-center gap-2"><Sprout size={16} /> Tasación profesional</p>
            <h2 className="reveal mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-graph md:text-5xl">¿Cuánto vale tu propiedad hoy?</h2>
            <p className="reveal mt-5 text-lg text-graph-500" data-delay="120ms">Te hacemos una tasación profesional, con informe escrito y valor de mercado real. Conocemos la zona, los precios y los compradores.</p>
            <div className="reveal mt-8 flex flex-wrap gap-4" data-delay="200ms">
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary"><Phone size={16} /> Pedir tasación</a>
              <a href="#contacto" className="btn-ghost">Dejar mis datos</a>
            </div>
            <div className="reveal mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-graph-500" data-delay="260ms">
              {["Informe escrito", "Valor de mercado real", "Sin cargo ni compromiso"].map((x) => (
                <span key={x} className="flex items-center gap-2"><ShieldCheck size={16} className="text-iagro" /> {x}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSOTROS ===== */}
      <section id="nosotros" className="border-t border-graph/10 bg-paper-100 py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="reveal relative">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img src="/img/campos/u4.jpg" alt="Campo serrano" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-iagro/25 bg-paper-100 px-7 py-5 shadow-card">
              <p className="font-display text-4xl font-semibold tracking-tight text-iagro">35</p>
              <p className="text-xs uppercase tracking-widest2 text-graph-400">años en la zona</p>
            </div>
          </div>
          <div>
            <p className="eyebrow reveal">Quiénes somos</p>
            <h2 className="reveal mt-3 font-display text-4xl font-medium tracking-tight text-graph md:text-5xl">I.A.G.R.O. — Inversiones Agrícolas, Ganaderas y Recursos Optativos</h2>
            <p className="reveal mt-6 text-lg leading-relaxed text-graph-500" data-delay="120ms">Desde 1989 operamos en Bahía Blanca y toda la zona, ayudando a familias, productores e inversores a comprar, vender y alquilar campos y propiedades. Conocemos cada barrio, cada partido y cada precio.</p>
            <ul className="reveal mt-8 space-y-4" data-delay="200ms">
              {["Conocimiento real de la zona y los valores de mercado", "Acompañamiento en toda la operación, hasta la escritura", "Cartera propia rural y urbana"].map((x) => (
                <li key={x} className="flex items-start gap-3 text-graph-700"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-iagro" /><span>{x}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="border-t border-graph/10 py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow reveal">Hablemos</p>
            <h2 className="reveal mt-3 font-display text-4xl font-medium tracking-tight text-graph md:text-5xl">Contanos qué estás buscando</h2>
            <p className="reveal mt-5 text-lg text-graph-500" data-delay="100ms">Te respondemos rápido por WhatsApp o teléfono. Sin vueltas.</p>
            <div className="reveal mt-9 space-y-5" data-delay="160ms">
              {[
                { icon: MapPin, t: "Oficina", d: "Av. Alem 703, Bahía Blanca" },
                { icon: Phone, t: "Teléfono", d: "0291 455 3410 / 4559140" },
                { icon: Mail, t: "Email", d: "iagro@iagrocampos.com.ar" },
                { icon: Clock, t: "Horario", d: "Lunes a Viernes · 9 a 18 hs" },
              ].map((c) => (
                <div key={c.t} className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-iagro-50 text-iagro"><c.icon size={20} /></span>
                  <div>
                    <p className="text-xs uppercase tracking-widest2 text-graph-400">{c.t}</p>
                    <p className="text-graph">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary reveal mt-9" data-delay="220ms"><Phone size={16} /> Escribinos por WhatsApp</a>
          </div>
          <ContactForm onEnviar={addLead} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[]; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-graph-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-[42px] w-full rounded-lg border border-graph/15 bg-paper-100 px-3 text-sm text-graph outline-none transition focus:border-iagro">
        <option value="">{placeholder}</option>
        {options.map((o) => (<option key={o.v} value={o.v}>{o.l}</option>))}
      </select>
    </label>
  );
}

function ContactForm({ onEnviar }: { onEnviar: (l: any) => void }) {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ nombre: "", telefono: "", email: "", mensaje: "" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnviar({
      id: "LEAD-" + Date.now(),
      fechaISO: new Date().toISOString(),
      nombre: f.nombre || "Consulta web",
      contacto: f.telefono || f.email || "—",
      campoId: null,
      canal: "web",
      estado: "nueva",
      asignado: "Sin asignar",
      notas: f.mensaje,
    });
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="reveal rounded-2xl border border-graph/10 bg-paper-100 p-7 shadow-card">
      {sent ? (
        <div className="flex h-full min-h-[340px] flex-col items-center justify-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-iagro-50 text-iagro"><ShieldCheck size={30} /></span>
          <h3 className="mt-5 font-display text-2xl text-graph">¡Consulta enviada!</h3>
          <p className="mt-2 max-w-xs text-sm text-graph-500">Te vamos a contactar a la brevedad. Gracias por confiar en IAGRO Campos.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Nombre y apellido" placeholder="Juan Pérez" value={f.nombre} onChange={(v) => set("nombre", v)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Teléfono" placeholder="+54 9 291 ..." value={f.telefono} onChange={(v) => set("telefono", v)} />
            <Field label="Email" placeholder="vos@email.com" value={f.email} onChange={(v) => set("email", v)} />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-graph-400">Mensaje</span>
            <textarea rows={4} value={f.mensaje} onChange={(e) => set("mensaje", e.target.value)} placeholder="Busco una casa de 3 dormitorios en Bahía Blanca, o un campo agrícola en la zona..." className="w-full rounded-lg border border-graph/15 bg-paper-100 px-4 py-3 text-sm text-graph outline-none transition placeholder:text-graph-400 focus:border-iagro" />
          </label>
          <button type="submit" className="btn-primary w-full">Enviar consulta <ArrowRight size={16} /></button>
          <p className="text-center text-xs text-graph-400">Respondemos de lunes a viernes de 9 a 18 hs.</p>
        </div>
      )}
    </form>
  );
}

function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-widest2 text-graph-400">{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-[46px] w-full rounded-lg border border-graph/15 bg-paper-100 px-4 text-sm text-graph outline-none transition placeholder:text-graph-400 focus:border-iagro" />
    </label>
  );
}
