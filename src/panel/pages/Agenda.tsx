import { useMemo } from "react";
import { Clock, MapPin, User, CalendarDays } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import type { Visita } from "@/data/types";
import { PageHeader } from "../components/PageShell";
import Badge from "../components/Badge";
import { estadoVisita } from "../ui/estados";
import { cn } from "../ui/cn";
import { hoyISO } from "@/lib/fechas";

const HOY = hoyISO();

function fechaLarga(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
}
function diaRelativo(iso: string): string | null {
  const dias = Math.round((+new Date(iso + "T12:00:00") - +new Date(HOY + "T12:00:00")) / 86400000);
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Mañana";
  if (dias === -1) return "Ayer";
  return null;
}

export default function Agenda() {
  const { visitas: allVisitas, getProp } = useData();
  const grupos = useMemo(() => {
    const sorted = [...allVisitas].sort(
      (a, b) => +new Date(a.fechaISO) - +new Date(b.fechaISO) || a.hora.localeCompare(b.hora)
    );
    const map = new Map<string, Visita[]>();
    sorted.forEach((v) => {
      const arr = map.get(v.fechaISO) ?? [];
      arr.push(v);
      map.set(v.fechaISO, arr);
    });
    return Array.from(map.entries());
  }, [allVisitas]);

  const total = allVisitas.length;
  const confirmadas = allVisitas.filter((v) => v.estado === "confirmada").length;

  return (
    <div>
      <PageHeader
        title="Agenda de visitas"
        subtitle={`${total} visitas programadas · ${confirmadas} confirmadas`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* timeline */}
        <div className="space-y-7">
          {grupos.map(([fecha, vs]) => {
            const rel = diaRelativo(fecha);
            const esHoy = fecha === HOY;
            return (
              <div key={fecha}>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className={cn("font-display text-sm font-semibold capitalize", esHoy ? "text-iagro" : "text-graph-500")}>
                    {fechaLarga(fecha)}
                  </h3>
                  {rel && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-bold",
                        rel === "Hoy" || rel === "Mañana" ? "bg-iagro text-white" : "bg-graph/[0.08] text-graph-400"
                      )}
                    >
                      {rel}
                    </span>
                  )}
                  <span className="text-xs text-graph-400">· {vs.length} visita{vs.length > 1 ? "s" : ""}</span>
                </div>

                <div className="space-y-2.5">
                  {vs.map((v) => {
                    const campo = getProp(v.campoId);
                    const e = estadoVisita[v.estado];
                    return (
                      <div
                        key={v.id}
                        className={cn(
                          "pcard flex items-center gap-4 p-4 transition",
                          esHoy && "border-iagro/40 ring-1 ring-inset ring-iagro/15"
                        )}
                      >
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-graph/[0.06] text-graph ring-1 ring-inset ring-graph/10">
                          <Clock size={14} className="text-iagro" />
                          <span className="mt-0.5 text-sm font-semibold leading-none">{v.hora}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-graph">{v.clienteNombre}</p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-graph-400">
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-iagro" /> {campo?.titulo ?? v.campoId}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <User size={12} /> {v.responsable}
                            </span>
                          </p>
                        </div>
                        <Badge tone={e.tone} dot>{e.label}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* mini calendario / resumen semana */}
        <aside className="space-y-4">
          <MiniCalendar fechasConVisita={allVisitas.map((v) => v.fechaISO)} />
          <div className="pcard p-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-graph-400">
              <CalendarDays size={13} /> Esta semana
            </p>
            <div className="space-y-2.5 text-sm">
              <Row label="Total visitas" value={total} />
              <Row label="Confirmadas" value={confirmadas} tone="green" />
              <Row label="Agendadas" value={allVisitas.filter((v) => v.estado === "agendada").length} tone="amber" />
              <Row label="Realizadas" value={allVisitas.filter((v) => v.estado === "realizada").length} tone="blue" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, tone }: { label: string; value: number; tone?: string }) {
  const dot = tone === "green" ? "bg-iagro-400" : tone === "amber" ? "bg-iagro" : tone === "blue" ? "bg-sky-400" : "bg-graph/30";
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-graph-500">
        <span className={cn("h-2 w-2 rounded-full", dot)} /> {label}
      </span>
      <span className="font-display font-semibold text-graph">{value}</span>
    </div>
  );
}

function MiniCalendar({ fechasConVisita }: { fechasConVisita: string[] }) {
  // Mes actual real, con la semana arrancando en lunes.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const hoy = now.getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = lunes
  const diasEnMes = new Date(year, month + 1, 0).getDate();
  const set = new Set(
    fechasConVisita
      .map((f) => new Date(f + "T12:00:00"))
      .filter((d) => d.getFullYear() === year && d.getMonth() === month)
      .map((d) => d.getDate())
  );
  const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1);
  const titulo = now.toLocaleDateString("es-AR", { month: "long", year: "numeric" });

  return (
    <div className="pcard p-5">
      <p className="mb-3 font-display text-sm font-semibold capitalize text-graph">{titulo}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-graph-400">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {dias.map((d) => {
          const tieneVisita = set.has(d);
          const esHoy = d === hoy;
          return (
            <span
              key={d}
              className={cn(
                "relative flex h-8 items-center justify-center rounded-lg text-xs font-medium transition",
                esHoy ? "bg-iagro text-white" : tieneVisita ? "bg-iagro/15 text-iagro" : "text-graph-400 hover:bg-graph/5"
              )}
            >
              {d}
              {tieneVisita && !esHoy && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-iagro" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
