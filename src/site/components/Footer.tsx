import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-graph/10 bg-paper text-graph">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-iagro font-display text-base font-bold text-white">
              iA
            </span>
            <span className="font-display text-xl font-semibold">
              IAGRO <span className="text-iagro">Campos</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-graph-500">
            La esquina de los buenos negocios. Inmobiliaria rural en Bahía Blanca
            desde 1989 — venta y arrendamiento de campos, chacras y estancias,
            tasaciones y asesoramiento de inversión.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.facebook.com/IagroCampos/"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-graph/15 transition hover:border-iagro hover:text-iagro"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://www.instagram.com/iagrocampos/"
              target="_blank"
              rel="noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-graph/15 transition hover:border-iagro hover:text-iagro"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="eyebrow mb-5">Navegación</h4>
          <ul className="space-y-3 text-sm text-graph-500">
            <li><Link to="/campos" className="hover:text-iagro">Campos en venta</Link></li>
            <li><a href="/#servicios" className="hover:text-iagro">Servicios</a></li>
            <li><a href="/#tasaciones" className="hover:text-iagro">Tasaciones</a></li>
            <li><a href="/#nosotros" className="hover:text-iagro">Nosotros</a></li>
            <li><Link to="/panel" className="hover:text-iagro">Panel (acceso interno)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-5">Contacto</h4>
          <ul className="space-y-4 text-sm text-graph-500">
            <li className="flex gap-3"><MapPin size={18} className="text-iagro shrink-0" /> Av. Alem 703, Bahía Blanca</li>
            <li className="flex gap-3"><Phone size={18} className="text-iagro shrink-0" /> 0291 455 3410</li>
            <li className="flex gap-3"><Mail size={18} className="text-iagro shrink-0" /> iagro@iagrocampos.com.ar</li>
            <li className="flex gap-3"><Clock size={18} className="text-iagro shrink-0" /> Lun a Vie · 9 a 18 hs</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-graph/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-graph-400 md:flex-row">
          <span>© {new Date().getFullYear()} IAGRO Campos · Todos los derechos reservados.</span>
          <span>
            Sitio + sistema desarrollado por{" "}
            <a href="https://www.wsk.com.ar" target="_blank" rel="noreferrer" className="text-iagro hover:text-iagro-700">
              WESEKA.IA
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
