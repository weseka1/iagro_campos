import { AlertTriangle, FileSignature, DollarSign, CalendarX } from "lucide-react";
import { useData } from "@/lib/DataProvider";
import { fmtUSD, fmtFecha, fmtHa } from "@/lib/format";
import { PageHeader } from "../components/PageShell";
import { Btn } from "../components/Controls";
import Badge from "../components/Badge";
import KpiCard from "../components/KpiCard";
import { useToast } from "../components/Toast";
import { estadoArrendamiento } from "../ui/estados";
import { cn } from "../ui/cn";

export default function Arrendamientos() {
  const { push } = useToast();
  const { arrendamientos: allArr, getProp } = useData();

  const ingresosAnuales = allArr
    .filter((a) => a.estado !== "vencido")
    .reduce((s, a) => s + a.valorAnualUSD, 0);
  const porVencer = allArr.filter((a) => a.estado === "por_vencer").length;
  const vencidos = allArr.filter((a) => a.estado === "vencido").length;
  const haTotal = allArr.reduce((s, a) => s + a.hectareas, 0);

  const alertas = allArr.filter((a) => a.estado !== "vigente");

  return (
    <div>
      <PageHeader
        title="Arrendamientos y contratos"
        subtitle={`${allArr.length} contratos · ${fmtHa(haTotal)} bajo administración`}
        actions={
          <Btn variant="primary" onClick={() => push("Formulario de nuevo contrato abierto…", "info")}>
            <FileSignature size={16} /> Nuevo contrato
          </Btn>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Ingresos anuales" value={fmtUSD(ingresosAnuales, { short: true })} icon={DollarSign} accent="field" hint="contratos vigentes" delta="+6%" />
        <KpiCard label="Por vencer" value={`${porVencer}`} icon={AlertTriangle} accent="wheat" hint="renovar pronto" />
        <KpiCard label="Vencidos" value={`${vencidos}`} icon={CalendarX} accent="clay" hint="requieren acción" />
      </div>

      {/* banda de alerta */}
      {alertas.length > 0 && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-iagro/30 bg-iagro/[0.08] p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-iagro" />
          <div className="text-sm">
            <p className="font-semibold text-graph">Atención: {alertas.length} contrato{alertas.length > 1 ? "s" : ""} requiere{alertas.length > 1 ? "n" : ""} gestión</p>
            <p className="mt-0.5 text-graph-400">
              {porVencer > 0 && `${porVencer} por vencer en los próximos meses`}
              {porVencer > 0 && vencidos > 0 && " · "}
              {vencidos > 0 && `${vencidos} vencido${vencidos > 1 ? "s" : ""} a regularizar`}
              .
            </p>
          </div>
        </div>
      )}

      <div className="pcard overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-graph/[0.07] bg-graph/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-graph-400">
                <th className="px-5 py-3">Campo / Arrendatario</th>
                <th className="px-5 py-3 text-right">Superficie</th>
                <th className="px-5 py-3 text-right">Valor anual</th>
                <th className="px-5 py-3">Inicio</th>
                <th className="px-5 py-3">Vencimiento</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-graph/[0.07]">
              {allArr.map((a) => {
                const campo = getProp(a.campoId);
                const e = estadoArrendamiento[a.estado];
                const alerta = a.estado !== "vigente";
                return (
                  <tr
                    key={a.id}
                    className={cn("transition hover:bg-graph/[0.03]", a.estado === "vencido" && "bg-red-500/[0.06]")}
                  >
                    <td className="px-5 py-3.5">
                      <p className="flex items-center gap-1.5 font-semibold text-graph">
                        {alerta && <AlertTriangle size={13} className={a.estado === "vencido" ? "text-red-700" : "text-iagro"} />}
                        {a.arrendatario}
                      </p>
                      <p className="text-xs text-graph-400">{campo?.zona ?? a.campoId} · {a.id}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-graph">{fmtHa(a.hectareas)}</td>
                    <td className="px-5 py-3.5 text-right font-display font-semibold text-graph">{fmtUSD(a.valorAnualUSD)}</td>
                    <td className="px-5 py-3.5 text-graph-400">{fmtFecha(a.inicioISO)}</td>
                    <td className={cn("px-5 py-3.5 font-medium", a.estado === "vencido" ? "text-red-700" : a.estado === "por_vencer" ? "text-iagro" : "text-graph-400")}>
                      {fmtFecha(a.vencimientoISO)}
                    </td>
                    <td className="px-5 py-3.5"><Badge tone={e.tone} dot>{e.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
