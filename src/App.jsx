import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Ship, Users, Shield, FileWarning, GraduationCap, ClipboardList,
  AlertTriangle, TrendingUp, DollarSign, Anchor, CheckCircle2, XCircle,
  Clock, Plus, Pencil, Trash2, Search, LogOut, ChevronRight, ChevronDown,
  X, Save, Eye, ScrollText, HeartPulse, CalendarClock, BadgeCheck,
  TrendingDown, Minus, Info, Crown, Lock, EyeOff, ShieldAlert,
} from "lucide-react";
import {
  C, FONT, SERVIPRAC_LOGO, SERVIPRAC_WATERMARK,
  REGLAMENTO_22, CRITERIOS, TOTAL_POND, VEREDICTOS_TABLA, NOTA_LEGAL_EVAL,
  DOTACION_REF, CARGOS, ESTADOS_CIVILES, CURSOS_REGINAVE, TIPOS_SANCION,
  TIPOS_EXAMEN_SRT, RESULTADOS_EXAMEN_SRT,
  GENEROS, TIPOS_CONTRATO, LEGAJO_VACIO, BENEF_VACIO, sumaPorcentajes, cbuValido, maskCBU, estadoLegajo,
  TIPOS_DOCUMENTO, VINCULOS, NIVELES_ESCOLARES, FAMILIAR_VACIO, cuilValido, formatCUIL,
  uid, todayISO, daysUntil, expiryTone, fmtDate, age, antiguedad,
  veredicto, groupByArea, useSupabaseTable,
  iniciarSesion, cerrarSesion, restaurarSesion,
  subirArchivoExamen, descargarArchivoExamen, borrarArchivoExamen,
} from "./lib.js";


/* Tipografía de la marca SIG (Uncial Antiqua · Google Fonts) */
if (typeof document !== "undefined" && !document.getElementById("font-uncial-antiqua")) {
  const l = document.createElement("link");
  l.id = "font-uncial-antiqua";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Uncial+Antiqua&family=Pirata+One&family=Noto+Sans+Runic&display=swap";
  document.head.appendChild(l);
}
if (typeof document !== "undefined" && !document.getElementById("sig-keyframes")) {
  const s = document.createElement("style");
  s.id = "sig-keyframes";
  s.textContent = "@keyframes sigSheen{0%{background-position:160% 0}55%,100%{background-position:-60% 0}}";
  document.head.appendChild(s);
}

/* Marca SIG — placa vikinga tallada en 3D con brillo e inclinación interactiva */
function SigPlaca() {
  const [tilt, setTilt] = useState(null);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -y * 22, ry: x * 26 });
  };
  const rivet = (pos) => (
    <span style={{ position: "absolute", ...pos, width: 7, height: 7, borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%,#FFF1C2,#C8960C 60%,#5A4205)", boxShadow: "0 1px 1px #000" }} />
  );
  const runas = (
    <div style={{ fontFamily: "'Noto Sans Runic', serif", color: "#B8890B", fontSize: 11, letterSpacing: 5,
      whiteSpace: "nowrap", overflow: "hidden", width: "100%", textAlign: "center",
      textShadow: "0 -1px 0 #000, 0 1px 0 rgba(255,241,194,0.18)" }}>ᛊᛁᚷ · ᛊᛁᚷ · ᛊᛁᚷ · ᛊᛁᚷ · ᛊᛁᚷ</div>
  );
  return (
    <div style={{ marginTop: 14, padding: "6px 6px 18px", perspective: 700 }}>
      <div onMouseMove={onMove} onMouseLeave={() => setTilt(null)} style={{
        position: "relative", overflow: "hidden", transformStyle: "preserve-3d",
        transform: tilt ? `perspective(700px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` : "perspective(700px) rotateX(12deg)",
        transition: "transform 0.25s ease-out",
        background: "linear-gradient(160deg,#0B2456 0%,#001238 55%,#000A22 100%)",
        border: "1px solid #E2B84A", borderRadius: 4, padding: "12px 14px 14px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        boxShadow: "inset 0 1px 0 rgba(255,241,194,0.25), inset 0 -2px 0 #000, inset 0 0 0 4px #001238, inset 0 0 0 5px rgba(200,150,12,0.55), 0 2px 0 #A47A0A, 0 4px 0 #7E5D07, 0 6px 0 #5A4205, 0 8px 0 #3A2A03, 0 18px 26px rgba(0,10,30,0.5)",
      }}>
        {rivet({ left: 7, top: 7 })}{rivet({ right: 7, top: 7 })}{rivet({ left: 7, bottom: 7 })}{rivet({ right: 7, bottom: 7 })}
        {runas}
        <div style={{
          fontFamily: "'Pirata One', Georgia, serif", fontSize: 70, letterSpacing: 8, lineHeight: 0.95, paddingLeft: 8,
          background: "linear-gradient(180deg,#FFF6D6 0%,#F3D68A 28%,#C8960C 52%,#8A6608 74%,#E2B84A 100%)",
          WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          filter: "drop-shadow(0 1px 0 #6E5206) drop-shadow(0 2px 0 #4F3B04) drop-shadow(0 3px 0 #2E2202) drop-shadow(0 6px 5px rgba(0,0,0,0.7))",
        }}>SIG</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.celeste, letterSpacing: 2.8, textTransform: "uppercase", textShadow: "0 1px 0 #000" }}>
          Sistema Integral de Gestión
        </div>
        {runas}
        <span aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
          background: "linear-gradient(105deg, transparent 38%, rgba(255,241,194,0.45) 50%, transparent 62%)",
          backgroundSize: "250% 100%", animation: "sigSheen 4s ease-in-out infinite",
        }} />
      </div>
    </div>
  );
}

function Pill({ children, bg, fg, size = 12 }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 9px", borderRadius: 20,
      background: bg, color: fg, fontSize: size, fontWeight: 700,
      whiteSpace: "nowrap", lineHeight: 1.4,
    }}>{children}</span>
  );
}

function IconBtn({ icon: Icon, onClick, tone = "default", title }) {
  const tones = {
    default: { bg: "#F1F4F9", fg: C.inkSoft },
    danger: { bg: C.redLight, fg: C.red },
    primary: { bg: C.celesteLight, fg: C.navy },
  };
  const t = tones[tone];
  return (
    <button onClick={onClick} title={title} style={{
      width: 30, height: 30, borderRadius: 8, border: "none", background: t.bg,
      color: t.fg, display: "inline-flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      <Icon size={15} />
    </button>
  );
}

function Btn({ children, onClick, tone = "primary", icon: Icon, disabled, full }) {
  const tones = {
    primary: { bg: C.navy, fg: "#fff" },
    gold: { bg: C.gold, fg: "#fff" },
    ghost: { bg: "#fff", fg: C.navy, border: `1.5px solid ${C.border}` },
    danger: { bg: C.red, fg: "#fff" },
  };
  const t = tones[tone];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
      padding: "9px 16px", borderRadius: 9, border: t.border || "none", background: t.bg,
      color: t.fg, fontWeight: 700, fontSize: 13.5, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, width: full ? "100%" : undefined, fontFamily: FONT,
    }}>
      {Icon && <Icon size={15} />}{children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", options, span, placeholder }) {
  return (
    <label style={{ display: "block", gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 4, letterSpacing: 0.2 }}>{label}</div>
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
          <option value="">Seleccionar…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </label>
  );
}
const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 8, border: `1.5px solid ${C.border}`,
  fontSize: 13.5, fontFamily: FONT, color: C.ink, background: "#fff", boxSizing: "border-box",
};

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,20,40,0.55)", zIndex: 100,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", width: "100%", maxWidth: wide ? 640 : 460, maxHeight: "88vh",
        overflowY: "auto", borderRadius: "16px 16px 0 0", padding: "18px 18px 24px",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{title}</div>
          <button onClick={onClose} style={{ border: "none", background: "#F1F4F9", borderRadius: 8, width: 30, height: 30, cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: C.inkSoft }}>
      <Icon size={30} style={{ opacity: 0.35, marginBottom: 10 }} />
      <div style={{ fontSize: 13.5 }}>{text}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 800, color: C.navy, lineHeight: 1.25 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

function EmpPicker({ value, onChange, empleados }) {
  const ordenados = [...empleados].sort((a, b) => a.apellido.localeCompare(b.apellido));
  return (
    <label style={{ display: "block", gridColumn: "span 2" }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 4 }}>Tripulante</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        <option value="">Seleccionar…</option>
        {ordenados.map((e) => (
          <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>
        ))}
      </select>
    </label>
  );
}
function empName(empleados, id) {
  const e = empleados.find((x) => x.id === id);
  return e ? `${e.apellido}, ${e.nombre}` : "—";
}

/* ─────────────────────────── TOP BAR / TABS ─────────────────────────── */

/* ─────────────────────────── LOGIN (Supabase Auth real) ─────────────────────────── */
/* ─────────────────────────── LOGIN (Supabase Auth real) ─────────────────────────── */
function LoginScreen({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = !!lockedUntil && now < lockedUntil;
  const secondsLeft = isLocked ? Math.ceil((lockedUntil - now) / 1000) : 0;

  async function submit() {
    if (!usuario.trim() || !password || checking || isLocked) return;
    setChecking(true);
    setError("");
    const res = await iniciarSesion(usuario, password);
    setChecking(false);
    if (res.error) {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 3) {
        const waitSec = Math.min(30 * Math.pow(2, attempts - 3), 300);
        setLockedUntil(Date.now() + waitSec * 1000);
        setError(`Demasiados intentos fallidos. Esperá ${waitSec} segundos antes de volver a intentar.`);
      } else {
        setError(res.error);
      }
    } else {
      setFailedAttempts(0);
      setLockedUntil(null);
      onLogin(res.user);
    }
  }

  const loginInputStyle = (field) => ({
    width: "100%",
    padding: "13px 14px 13px 42px",
    borderRadius: 10,
    border: `1.5px solid ${focusField === field ? C.navy : "#E4E9F2"}`,
    fontSize: 14.5,
    fontFamily: FONT,
    color: C.ink,
    background: "#FAFBFD",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s ease",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#FFFFFF", position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center",
      padding: "40px 24px", fontFamily: FONT,
    }}>
      {/* Video de fondo: lancha SERVIPRAC Practicaje real, más intenso — se ve la embarcación */}
      <video autoPlay muted loop playsInline style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", opacity: 0.62, zIndex: 0,
      }}>
        <source src="/practicaje.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, background: "rgba(255,255,255,0.28)", zIndex: 1,
      }} />

      <div style={{ width: "100%", maxWidth: 388, position: "relative", zIndex: 2 }}>

        {/* Zona superior: marca de agua como elemento propio, no de fondo */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <img src={SERVIPRAC_WATERMARK} alt="SERVIPRAC S.A." style={{
            width: "min(78vw, 300px)", height: "auto", objectFit: "contain",
            margin: "0 auto", display: "block",
            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.25))",
          }} />
        </div>

        <div style={{
          textAlign: "center", marginBottom: 32, background: "rgba(255,255,255,0.82)",
          borderRadius: 14, padding: "12px 18px", backdropFilter: "blur(2px)",
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.15 }}>
            <span style={{ color: C.navy }}>SERVIPRAC</span>{" "}
            <span style={{ color: C.gold }}>Bridge</span>
          </div>
          <div style={{ color: C.ink, fontSize: 13, fontWeight: 500, marginTop: 3 }}>
            El centro de mando de la empresa.
          </div>
          <SigPlaca />
        </div>

        {/* Tarjeta de acceso */}
        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,20,60,0.06), 0 16px 40px rgba(0,20,60,0.10)",
        }}>
          <div style={{ height: 3, background: C.gold }} />
          <div style={{ padding: "28px 24px 24px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: C.navy, letterSpacing: 1.2, marginBottom: 20, textAlign: "center" }}>
              INICIAR SESIÓN
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginBottom: 5, letterSpacing: 0.2 }}>USUARIO</div>
              <div style={{ position: "relative" }}>
                <Users size={16} color={focusField === "usuario" ? C.navy : "#A6B0C3"} style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  onFocus={() => setFocusField("usuario")}
                  onBlur={() => setFocusField(null)}
                  onKeyDown={(e) => e.key === "Enter" && !isLocked && submit()}
                  style={loginInputStyle("usuario")}
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft, marginBottom: 5, letterSpacing: 0.2 }}>CONTRASEÑA</div>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={focusField === "password" ? C.navy : "#A6B0C3"} style={{ position: "absolute", left: 14, top: 14 }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  onFocus={() => setFocusField("password")}
                  onBlur={() => setFocusField(null)}
                  onKeyDown={(e) => e.key === "Enter" && !isLocked && submit()}
                  style={{ ...loginInputStyle("password"), paddingRight: 42 }}
                />
                <button onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 10, top: 10, background: "transparent", border: "none",
                  cursor: "pointer", color: "#A6B0C3", padding: 4,
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                color: C.red, fontSize: 12, fontWeight: 700, margin: "10px 0 2px",
                background: C.redLight, padding: "8px 10px", borderRadius: 8,
              }}>{error}</div>
            )}

            <div style={{ marginTop: 18 }}>
              <button
                onClick={submit}
                disabled={checking || !usuario || !password || isLocked}
                style={{
                  width: "100%", padding: "13px 16px", borderRadius: 10, border: "none",
                  background: checking || !usuario || !password || isLocked ? "#B9C2D1" : C.navy,
                  color: "#fff", fontWeight: 800, fontSize: 14.5, letterSpacing: 0.3,
                  cursor: checking || !usuario || !password || isLocked ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <Lock size={15} />
                {checking ? "Verificando…" : isLocked ? `Esperá ${secondsLeft}s` : "Ingresar"}
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer de seguridad */}
        <div style={{
          marginTop: 18, display: "flex", gap: 8, padding: "10px 12px",
          background: "rgba(255,255,255,0.82)", borderRadius: 10, backdropFilter: "blur(2px)",
        }}>
          <ShieldAlert size={14} color={C.inkSoft} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 10.5, color: C.inkSoft, lineHeight: 1.45 }}>
            Las contraseñas nunca se guardan en el código ni en este navegador.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── APP (conectada a Supabase) ─────────────────────────── */
export default function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const role = currentUser?.rol || null;
  const [tab, setTab] = useState("dashboard");
  const canEdit = role === "rrhh" || role === "presidente";
  const seesNomina = role === "rrhh" || role === "presidente";

  useEffect(() => {
    (async () => {
      const u = await restaurarSesion();
      setCurrentUser(u);
      setCheckingSession(false);
    })();
  }, []);

  const [empleados, setEmpleados, r1] = useSupabaseTable("empleados");
  const [capacitaciones, setCapacitaciones, r2] = useSupabaseTable("capacitaciones");
  const [embarcos, setEmbarcos, r3] = useSupabaseTable("embarcos");
  const [sanciones, setSanciones, r4] = useSupabaseTable("sanciones");
  const [incidentes, setIncidentes, r5] = useSupabaseTable("incidentes");
  const [evaluaciones, setEvaluaciones, r6] = useSupabaseTable("evaluaciones");
  const [nomina, setNomina, r7] = useSupabaseTable("nomina_salarial");
  const [embarcaciones, setEmbarcaciones, r8] = useSupabaseTable("embarcaciones");
  const [auditoria, setAuditoria, r9] = useSupabaseTable("auditoria");
  const [examenesSRT, setExamenesSRT, r10] = useSupabaseTable("examenes_srt");
  const [legajos, setLegajos] = useSupabaseTable("legajos");
  const [beneficiarios, setBeneficiarios] = useSupabaseTable("beneficiarios");
  const [grupoFamiliar, setGrupoFamiliar] = useSupabaseTable("grupo_familiar");
  const [errorGuardado, setErrorGuardado] = useState(null);
  useEffect(() => {
    const h = (e) => setErrorGuardado(e.detail);
    window.addEventListener("serviprac-error", h);
    return () => window.removeEventListener("serviprac-error", h);
  }, []);

  const ready = r1 && r2 && r3 && r4 && r5 && r6 && r7 && r8;
  const isPresidente = role === "presidente";
  const accesoRestringido = role === "director" || role === "vicepresidente";

  const TABS = useMemo(() => {
    if (accesoRestringido) {
      return [
        { id: "dashboard", label: "Dashboard", icon: TrendingUp },
        { id: "sanciones", label: "Sanciones", icon: FileWarning },
        { id: "incidentes", label: "Incidentes", icon: AlertTriangle },
      ];
    }
    return [
      { id: "dashboard", label: "Dashboard", icon: TrendingUp },
      { id: "personal", label: "Personal", icon: Users },
      { id: "embarcaciones", label: "Embarcaciones", icon: Ship },
      { id: "habilitaciones", label: "Habilitaciones", icon: BadgeCheck },
      { id: "medicos", label: "Cert. Médicos", icon: HeartPulse },
      { id: "capacitacion", label: "Capacitación", icon: GraduationCap },
      { id: "dotacion", label: "Dotación Mínima", icon: Anchor },
      { id: "embarcos", label: "Embarcos", icon: Ship },
      { id: "reglamento", label: "Reglamento 22 Pts.", icon: ScrollText },
      { id: "sanciones", label: "Sanciones", icon: FileWarning },
      { id: "incidentes", label: "Incidentes", icon: AlertTriangle },
      { id: "evaluacion", label: "Evaluación", icon: ClipboardList },
      { id: "historial", label: "Hist. Evaluaciones", icon: Clock },
      ...(seesNomina ? [{ id: "nomina", label: "Nómina y CCT", icon: DollarSign }] : []),
      ...(isPresidente ? [{ id: "auditoria", label: "Auditoría", icon: Shield }] : []),
    ];
  }, [seesNomina, isPresidente, accesoRestringido]);

  if (checkingSession) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.navy, color: "#fff", fontFamily: FONT }}>
        Cargando…
      </div>
    );
  }

  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT, color: C.ink }}>
      <TopBar currentUser={currentUser} onSwitch={async () => { await cerrarSesion(); setCurrentUser(null); }} />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 12px 60px" }}>
        {errorGuardado && (
          <div style={{ background: C.redLight, color: C.red, border: `1px solid ${C.red}`, padding: 10, borderRadius: 10, fontSize: 12.5, marginBottom: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <b>No se pudo {errorGuardado.accion} en «{errorGuardado.tabla}».</b> Los cambios no quedaron registrados en la base de datos.
              <div style={{ fontSize: 11, marginTop: 3, opacity: 0.85 }}>{errorGuardado.mensaje}</div>
            </div>
            <button onClick={() => setErrorGuardado(null)} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", fontWeight: 800 }}>✕</button>
          </div>
        )}
        {!ready ? (
          <div style={{ textAlign: "center", padding: 60, color: C.inkSoft }}>Cargando datos…</div>
        ) : (
          <>
            {tab === "dashboard" && (
              <Dashboard empleados={empleados} sanciones={sanciones} incidentes={incidentes}
                evaluaciones={evaluaciones} capacitaciones={capacitaciones} role={role} />
            )}
            {tab === "personal" && (
              <PersonalTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit} embarcaciones={embarcaciones}
                legajos={legajos} setLegajos={setLegajos} beneficiarios={beneficiarios} setBeneficiarios={setBeneficiarios} nomina={nomina}
                grupoFamiliar={grupoFamiliar} setGrupoFamiliar={setGrupoFamiliar} />
            )}
            {tab === "embarcaciones" && (
              <EmbarcacionesTab items={embarcaciones} setItems={setEmbarcaciones} isPresidente={isPresidente} />
            )}
            {tab === "habilitaciones" && (
              <HabilitacionesTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit} />
            )}
            {tab === "medicos" && (
              <MedicosTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit}
                examenesSRT={examenesSRT} setExamenesSRT={setExamenesSRT} />
            )}
            {tab === "capacitacion" && (
              <CapacitacionTab empleados={empleados} items={capacitaciones} setItems={setCapacitaciones} canEdit={canEdit} />
            )}
            {tab === "dotacion" && <DotacionTab empleados={empleados} embarcaciones={embarcaciones} />}
            {tab === "embarcos" && (
              <EmbarcosTab empleados={empleados} items={embarcos} setItems={setEmbarcos} canEdit={canEdit} embarcaciones={embarcaciones} />
            )}
            {tab === "reglamento" && <ReglamentoTab />}
            {tab === "sanciones" && (
              <SancionesTab empleados={empleados} items={sanciones} setItems={setSanciones} canEdit={canEdit} />
            )}
            {tab === "incidentes" && (
              <IncidentesTab empleados={empleados} items={incidentes} setItems={setIncidentes} canEdit={canEdit} />
            )}
            {tab === "evaluacion" && (
              <EvaluacionTab empleados={empleados} onSave={(ev) => setEvaluaciones([ev, ...evaluaciones])} canEdit={canEdit} />
            )}
            {tab === "historial" && <HistorialTab empleados={empleados} items={evaluaciones} />}
            {tab === "nomina" && seesNomina && (
              <NominaCCTTab empleados={empleados} items={nomina} setItems={setNomina} canEdit={canEdit} />
            )}
            {tab === "auditoria" && isPresidente && (
              <AuditoriaTab items={auditoria} empleados={empleados} />
            )}
          </>
        )}
      </div>
    </div>
  );
}


const ROLE_META = {
  presidente: { label: "PRESIDENCIA", bg: C.gold, icon: Crown },
  rrhh: { label: "RRHH", bg: C.celeste, icon: Users },
  director: { label: "DIRECTOR", bg: "#5B6472", icon: Shield },
  vicepresidente: { label: "VICEPRESIDENTE", bg: "#5B6472", icon: Shield },
};

function TopBar({ currentUser, onSwitch }) {
  const rm = ROLE_META[currentUser.rol];
  return (
    <div style={{ background: C.navy, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}>
          <img src={SERVIPRAC_LOGO} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 14.5, lineHeight: 1.1 }}>SERVIPRAC S.A.</div>
          <div style={{ color: C.celeste, fontSize: 10.5, fontWeight: 600 }}>{currentUser.nombre}</div>
        </div>
      </div>
      <button onClick={onSwitch} style={{
        display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "none",
        color: "#fff", padding: "7px 11px", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
      }}>
        <Pill bg={rm.bg} fg="#fff" size={10.5}>{rm.label}</Pill>
        <LogOut size={13} />
      </button>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      background: "#fff", borderBottom: `1.5px solid ${C.border}`, position: "sticky", top: 0, zIndex: 20,
      overflowX: "auto", whiteSpace: "nowrap", padding: "0 8px",
    }}>
      <div style={{ display: "inline-flex" }}>
        {tabs.map((t) => {
          const isActive = active === t.id;
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "10px 13px 8px", border: "none", background: "transparent", cursor: "pointer",
              borderBottom: isActive ? `3px solid ${C.gold}` : "3px solid transparent",
            }}>
              <Icon size={16} color={isActive ? C.navy : C.inkSoft} />
              <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? C.navy : C.inkSoft, whiteSpace: "nowrap" }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── DASHBOARD ─────────────────────────── */
function Dashboard({ empleados, sanciones, incidentes, evaluaciones, capacitaciones, role }) {
  const vencHabPronto = empleados.filter((e) => { const d = daysUntil(e.vencHabilitacion); return d !== null && d <= 60; }).length;
  const vencMedPronto = empleados.filter((e) => { const d = daysUntil(e.vencCertMedico); return d !== null && d <= 60; }).length;
  const sinCargo = empleados.filter((e) => !e.cargo).length;
  const sancionesAbiertas = sanciones.filter((s) => s.estado !== "Cerrado").length;
  const incidentesMes = incidentes.filter((i) => { const d = daysUntil(i.fecha); return d !== null && d >= -30; }).length;
  const evalProm = evaluaciones.length
    ? (evaluaciones.reduce((a, e) => a + Number(e.puntaje || 0), 0) / evaluaciones.length).toFixed(2)
    : "—";

  const cards = [
    { label: "Personal Activo", value: empleados.filter((e) => e.estado === "Activo").length, icon: Users, tone: C.navy },
    { label: "Habilit. por vencer (≤60d)", value: vencHabPronto, icon: BadgeCheck, tone: vencHabPronto ? C.red : C.green },
    { label: "Cert. médicos por vencer", value: vencMedPronto, icon: HeartPulse, tone: vencMedPronto ? C.red : C.green },
    { label: "Legajos sin cargo asignado", value: sinCargo, icon: AlertTriangle, tone: sinCargo ? C.orange : C.green },
    { label: "Sanciones abiertas", value: sancionesAbiertas, icon: FileWarning, tone: sancionesAbiertas ? C.orange : C.green },
    { label: "Incidentes (30 días)", value: incidentesMes, icon: AlertTriangle, tone: incidentesMes ? C.red : C.green },
    { label: "Puntaje evaluación prom.", value: evalProm, icon: ClipboardList, tone: C.gold },
    { label: "Cursos REGINAVE registrados", value: capacitaciones.length, icon: GraduationCap, tone: C.celeste },
  ];

  const alertas = [
    ...empleados.filter((e) => { const d = daysUntil(e.vencHabilitacion); return d !== null && d <= 60; })
      .map((e) => ({ text: `Habilitación de ${e.apellido}, ${e.nombre} — ${expiryTone(e.vencHabilitacion).label.toLowerCase()}`, tone: expiryTone(e.vencHabilitacion) })),
    ...empleados.filter((e) => { const d = daysUntil(e.vencCertMedico); return d !== null && d <= 60; })
      .map((e) => ({ text: `Cert. médico de ${e.apellido}, ${e.nombre} — ${expiryTone(e.vencCertMedico).label.toLowerCase()}`, tone: expiryTone(e.vencCertMedico) })),
  ].slice(0, 8);

  return (
    <div>
      <SectionTitle icon={TrendingUp} title="Panel General" subtitle="Indicadores en vivo del personal embarcado" />
      {role === "presidente" && (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: C.goldLight, border: `1px solid ${C.gold}`, borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <Crown size={16} color={C.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 11.5, color: "#6B5A0A", lineHeight: 1.4 }}>
            Vista de Presidencia — visibilidad y edición total sobre las 4 áreas operativas del organigrama,
            incluyendo Nómina y CCT. Conforme a la estructura de gobierno directo aprobada por el Directorio.
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 18 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: C.card, borderRadius: 13, padding: 14, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <c.icon size={16} color={c.tone} />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{c.value}</div>
            <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2, lineHeight: 1.3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, borderRadius: 13, padding: 16, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertTriangle size={15} color={C.orange} /> Alertas de vencimiento
        </div>
        {alertas.length === 0 ? (
          <div style={{ fontSize: 12.5, color: C.inkSoft }}>Sin alertas activas en los próximos 60 días.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertas.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: a.tone.fg, flexShrink: 0 }} />
                {a.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
function PersonalTab({ empleados, setEmpleados, canEdit, embarcaciones, legajos, setLegajos, beneficiarios, setBeneficiarios, nomina, grupoFamiliar, setGrupoFamiliar }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  const legPorEmp = Object.fromEntries(legajos.map((l) => [l.empleadoId, l]));
  const nomPorEmp = Object.fromEntries(nomina.map((n) => [n.empleadoId, n]));
  const benDe = (id) => beneficiarios.filter((b) => b.empleadoId === id).sort((a, b) => a.orden - b.orden);
  const famDe = (id) => grupoFamiliar.filter((f) => f.empleadoId === id);

  const filtered = empleados.filter((e) =>
    `${e.apellido} ${e.nombre} ${e.dni}`.toLowerCase().includes(q.toLowerCase())
  );
  const ordenados = [...filtered].sort((a, b) => {
    if ((a.estado === "Baja") !== (b.estado === "Baja")) return a.estado === "Baja" ? 1 : -1;
    return a.apellido.localeCompare(b.apellido);
  });

  async function guardarLegajo(empId, leg) {
    const actual = legajos.find((l) => l.empleadoId === empId);
    if (actual) await setLegajos(legajos.map((l) => (l.id === actual.id ? { ...actual, ...leg, id: actual.id, empleadoId: empId } : l)));
    else await setLegajos([{ ...leg, id: uid("LEG"), empleadoId: empId }, ...legajos]);
  }
  async function guardarBenef(empId, filas) {
    const previos = beneficiarios.filter((b) => b.empleadoId === empId);
    const nuevos = filas.filter((f) => f.nombre.trim()).map((f, i) => {
      const previo = previos.find((p) => p.orden === i + 1);
      return { ...f, nombre: f.nombre.trim(), empleadoId: empId, orden: i + 1, id: previo ? previo.id : uid("BEN") };
    });
    await setBeneficiarios([...beneficiarios.filter((b) => b.empleadoId !== empId), ...nuevos]);
  }

  async function guardarFamilia(empId, filas) {
    const nuevos = filas.map((f) => ({
      ...f, apellidos: f.apellidos.trim(), nombres: f.nombres.trim(), cuil: formatCUIL(f.cuil),
      empleadoId: empId, id: f.id || uid("FAM"),
    }));
    await setGrupoFamiliar([...grupoFamiliar.filter((f) => f.empleadoId !== empId), ...nuevos]);
  }

  async function save(emp, leg, bens, fams) {
    setEditing(null);
    setEmpleados(empleados.map((e) => (e.id === emp.id ? emp : e)));
    await guardarLegajo(emp.id, leg);
    await guardarFamilia(emp.id, fams);
    await guardarBenef(emp.id, bens);
  }
  async function add(emp, leg, bens, fams) {
    setAdding(false);
    const insertados = await setEmpleados([{ ...emp, id: uid("EMP") }, ...empleados]);
    const real = insertados && insertados[0];
    if (!real) return;              // el aviso de error ya se mostró
    await guardarLegajo(real.id, leg);
    await guardarFamilia(real.id, fams);
    await guardarBenef(real.id, bens);
  }
  function toggleBaja(emp) {
    setEmpleados(empleados.map((e) => (e.id === emp.id ? { ...e, estado: e.estado === "Baja" ? "Activo" : "Baja" } : e)));
  }

  return (
    <div>
      <SectionTitle icon={Users} title="Personal" subtitle={`${empleados.length} trabajadores registrados`}
        action={canEdit && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nuevo trabajador</Btn>} />
      <SearchBox q={q} setQ={setQ} placeholder="Buscar por apellido, nombre o DNI…" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ordenados.map((e) => {
          const est = estadoLegajo(legPorEmp[e.id], benDe(e.id));
          const completo = est.hechos === est.total;
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, opacity: e.estado === "Baja" ? 0.55 : 1 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: C.celesteLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: C.navy, fontSize: 13 }}>
                {e.apellido[0]}{e.nombre[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft }}>
                  DNI {e.dni} · {e.cargo || "Sin cargo asignado"} · Antig. {antiguedad(e.fIngreso)}a
                </div>
                <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {e.estado === "Baja" && <Pill bg={C.redLight} fg={C.red}>Baja</Pill>}
                  {canEdit && famDe(e.id).length > 0 && (
                    <Pill bg={C.celesteLight} fg={C.navy}>Grupo familiar: {famDe(e.id).length}</Pill>
                  )}
                  {canEdit && (
                    <span title={completo ? "Legajo completo" : `Falta: ${est.faltan.join(", ")}`}>
                      <Pill bg={completo ? C.greenLight : C.orangeLight} fg={completo ? C.green : C.orange}>Legajo {est.hechos}/{est.total}</Pill>
                    </span>
                  )}
                </div>
              </div>
              {canEdit && (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <IconBtn icon={Pencil} tone="primary" onClick={() => setEditing(e)} title="Editar legajo" />
                  <IconBtn icon={e.estado === "Baja" ? CheckCircle2 : XCircle} tone={e.estado === "Baja" ? "primary" : "danger"}
                    onClick={() => toggleBaja(e)} title={e.estado === "Baja" ? "Reactivar" : "Dar de baja"} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState icon={Users} text="Sin resultados." />}
      </div>

      {adding && (
        <Modal title="Nuevo trabajador — Legajo" onClose={() => setAdding(false)} wide>
          <PersonalForm onCancel={() => setAdding(false)} onSave={add} embarcaciones={embarcaciones} />
        </Modal>
      )}
      {editing && (
        <Modal title={`Legajo — ${editing.apellido}, ${editing.nombre}`} onClose={() => setEditing(null)} wide>
          <PersonalForm emp={editing} legajo={legPorEmp[editing.id]} benefs={benDe(editing.id)} familia={famDe(editing.id)} nomina={nomPorEmp[editing.id]}
            onCancel={() => setEditing(null)} onSave={save} embarcaciones={embarcaciones} />
        </Modal>
      )}
    </div>
  );
}

function SearchBox({ q, setQ, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <Search size={15} color={C.inkSoft} style={{ position: "absolute", left: 12, top: 11 }} />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle, paddingLeft: 34 }} />
    </div>
  );
}

function Casilla({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.ink, cursor: "pointer",
      background: checked ? C.celesteLight : C.card, border: `1px solid ${checked ? C.celeste : C.border}`, borderRadius: 8, padding: "8px 10px" }}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 16, height: 16, accentColor: C.navy }} />
      {label}
    </label>
  );
}

function PersonalForm({ emp, legajo, benefs, familia, nomina, onCancel, onSave, embarcaciones }) {
  const [f, setF] = useState(emp || {
    apellido: "", nombre: "", dni: "", cuil: "", fNacimiento: "", fIngreso: todayISO(),
    cargo: "", lancha: "", estado: "Activo",
    libretaEmbarco: "", vencLibreta: "", vencHabilitacion: "", vencCertMedico: "",
  });
  const [l, setL] = useState({ ...LEGAJO_VACIO, ...(legajo || {}) });
  const [bs, setBs] = useState(() => [0, 1, 2].map((i) => {
    const b = (benefs || []).find((x) => x.orden === i + 1);
    return b ? { ...b } : BENEF_VACIO();
  }));
  const [fams, setFams] = useState(() => (familia || []).map((x) => ({ ...x })));
  const [intento, setIntento] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const setLeg = (k) => (v) => setL({ ...l, [k]: v });
  const setBen = (i, k) => (v) => setBs(bs.map((b, j) => (j === i ? { ...b, [k]: v } : b)));
  const setFam = (i, k) => (v) => setFams(fams.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const lanchaOpciones = (embarcaciones || []).filter((b) => b.estado === "Activa").map((b) => b.nombre);

  const cargados = bs.filter((b) => b.nombre.trim());
  const suma = sumaPorcentajes(cargados);
  const errores = [];
  if (!f.apellido.trim() || !f.nombre.trim()) errores.push("Apellido y nombre son obligatorios.");
  if (bs.some((b) => !b.nombre.trim() && (b.dni || b.parentesco || b.fechaNacimiento || b.telefono || b.porcentaje)))
    errores.push("Hay un beneficiario con datos pero sin nombre completo.");
  if (cargados.length > 0) {
    if (cargados.some((b) => !(parseFloat(b.porcentaje) > 0))) errores.push("Cada beneficiario debe tener un porcentaje mayor a 0.");
    else if (Math.abs(suma - 100) > 0.001) errores.push(`Los porcentajes de los beneficiarios suman ${suma}%: deben sumar exactamente 100%.`);
  }
  const hoyISO = todayISO();
  const anioActual = new Date().getFullYear();
  fams.forEach((x, i) => {
    const n = `Familiar ${i + 1}`;
    if (!x.apellidos.trim() || !x.nombres.trim()) errores.push(`${n}: apellidos y nombres son obligatorios.`);
    if (!x.vinculo) errores.push(`${n}: indicá el vínculo o parentesco.`);
    if (x.cuil && !cuilValido(x.cuil)) errores.push(`${n}: el CUIL no es válido (revisá los 11 dígitos).`);
    if (x.fechaNacimiento && x.fechaNacimiento > hoyISO) errores.push(`${n}: la fecha de nacimiento no puede ser futura.`);
    if (x.certificadoEscolarAnio && !/^\d{4}$/.test(x.certificadoEscolarAnio)) errores.push(`${n}: el año del certificado escolar debe tener 4 dígitos.`);
  });
  if (l.derivaPrepaga && !(l.prepaga || "").trim()) errores.push("Cobertura médica: indicá a qué prepaga deriva los aportes.");
  function guardar() {
    if (errores.length) { setIntento(true); return; }
    onSave(f, l, bs, fams);
  }

  const grid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 };
  const seccion = (txt) => (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: C.navy, textTransform: "uppercase",
      borderBottom: `2px solid ${C.gold}`, paddingBottom: 4, marginBottom: 10 }}>{txt}</div>
  );
  const nota = (txt) => <div style={{ fontSize: 11, color: C.inkSoft, marginBottom: 10, lineHeight: 1.45 }}>{txt}</div>;
  const remun = nomina && nomina.salarioBasico ? `$ ${Number(nomina.salarioBasico).toLocaleString("es-AR")}` : "sin cargar";

  return (
    <div>
      {seccion("1. Datos personales del trabajador")}
      <div style={grid}>
        <Field label="Apellido(s)" value={f.apellido} onChange={set("apellido")} />
        <Field label="Nombre(s)" value={f.nombre} onChange={set("nombre")} />
        <Field label="Documento de identidad (DNI)" value={f.dni} onChange={set("dni")} />
        <Field label="CUIL" value={f.cuil} onChange={set("cuil")} />
        <Field label="Fecha de nacimiento" type="date" value={f.fNacimiento} onChange={set("fNacimiento")} />
        <Field label="Lugar de nacimiento" value={l.lugarNacimiento} onChange={setLeg("lugarNacimiento")} />
        <Field label="Nacionalidad" value={l.nacionalidad} onChange={setLeg("nacionalidad")} />
        <Field label="Estado civil" value={l.estadoCivil} onChange={setLeg("estadoCivil")} options={ESTADOS_CIVILES} />
        <Field label="Género" value={l.genero} onChange={setLeg("genero")} options={GENEROS} />
        <div />
      </div>

      {seccion("2. Datos de contacto y domicilio")}
      <div style={grid}>
        <Field label="Domicilio actual (calle y número)" value={l.domicilioCalle} onChange={setLeg("domicilioCalle")} span={2} />
        <Field label="Piso / Departamento" value={l.domicilioPiso} onChange={setLeg("domicilioPiso")} />
        <Field label="Código postal" value={l.codigoPostal} onChange={setLeg("codigoPostal")} />
        <Field label="Ciudad" value={l.ciudad} onChange={setLeg("ciudad")} />
        <Field label="Provincia" value={l.provincia} onChange={setLeg("provincia")} />
        <Field label="País" value={l.pais} onChange={setLeg("pais")} />
        <div />
        <Field label="Teléfono celular" value={l.telefonoCelular} onChange={setLeg("telefonoCelular")} />
        <Field label="Teléfono fijo" value={l.telefonoFijo} onChange={setLeg("telefonoFijo")} />
        <Field label="Correo electrónico personal" value={l.email} onChange={setLeg("email")} span={2} />
      </div>

      {seccion("3. Información laboral (uso exclusivo de la empresa)")}
      <div style={grid}>
        <Field label="Código de empleado" value={l.codigoEmpleado} onChange={setLeg("codigoEmpleado")} />
        <Field label="Fecha de ingreso" type="date" value={f.fIngreso} onChange={set("fIngreso")} />
        <Field label="Puesto / Cargo" value={f.cargo} onChange={set("cargo")} options={CARGOS} />
        <Field label="Área / Departamento" value={l.area} onChange={setLeg("area")} />
        <Field label="Tipo de contrato" value={l.tipoContrato} onChange={setLeg("tipoContrato")} options={TIPOS_CONTRATO} />
        <Field label="Lancha asignada" value={f.lancha} onChange={set("lancha")} options={lanchaOpciones} />
        <Field label="Estado" value={f.estado} onChange={set("estado")} options={["Activo", "Licencia", "Suspendido", "Baja"]} />
        <div />
        <div style={{ gridColumn: "span 2", background: C.celesteLight, color: C.navy, borderRadius: 10, padding: 10, fontSize: 11.5, lineHeight: 1.5 }}>
          <b>Remuneración bruta mensual:</b> {remun} &nbsp;·&nbsp; <b>CBU:</b> {nomina && nomina.cbu ? maskCBU(nomina.cbu) : "sin cargar"}
          <div style={{ opacity: 0.8, marginTop: 2 }}>Se editan en la pestaña «Nómina y CCT» (acceso restringido).</div>
        </div>
      </div>

      {seccion("4. Cobertura médica")}
      <div style={grid}>
        <Field label="Obra social" value={l.obraSocial} onChange={setLeg("obraSocial")} placeholder="Nombre de la obra social" />
        <Field label="N° de afiliado" value={l.obraSocialAfiliado} onChange={setLeg("obraSocialAfiliado")} />
        <div style={{ gridColumn: "span 2" }}>
          <Casilla label="Deriva sus aportes a una prepaga" checked={l.derivaPrepaga} onChange={setLeg("derivaPrepaga")} />
        </div>
        {l.derivaPrepaga && (
          <>
            <Field label="Prepaga" value={l.prepaga} onChange={setLeg("prepaga")} />
            <Field label="N° de socio de la prepaga" value={l.prepagaAfiliado} onChange={setLeg("prepagaAfiliado")} />
          </>
        )}
      </div>

      {seccion("5. Contacto de emergencia")}
      <div style={grid}>
        <Field label="Nombre completo" value={l.emergenciaNombre} onChange={setLeg("emergenciaNombre")} />
        <Field label="Parentesco" value={l.emergenciaParentesco} onChange={setLeg("emergenciaParentesco")} />
        <Field label="Teléfono de contacto (24/7)" value={l.emergenciaTelefono} onChange={setLeg("emergenciaTelefono")} span={2} />
      </div>

      {seccion("6. Grupo familiar")}
      {nota("Cónyuge, concubino/a, hijos/as y otros familiares. Indicá si está a cargo del trabajador y si genera derecho a asignaciones familiares y a cobertura de obra social.")}
      {fams.map((x, i) => {
        const edad = x.fechaNacimiento ? age(x.fechaNacimiento) : null;
        const esHijo = x.vinculo === "Hijo/a";
        const certViejo = esHijo && x.nivelEscolar && x.nivelEscolar !== "No escolarizado" && x.certificadoEscolarAnio !== String(anioActual);
        const cudVencido = x.discapacidad && x.cudVencimiento && x.cudVencimiento < hoyISO;
        return (
          <div key={x.id || `n${i}`} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: C.navy }}>
                Familiar {i + 1}{x.vinculo ? ` · ${x.vinculo}` : ""}{edad !== null && edad !== "—" ? ` · ${edad} años` : ""}
              </div>
              <IconBtn icon={Trash2} tone="danger" onClick={() => setFams(fams.filter((_, j) => j !== i))} title="Quitar familiar" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Apellido(s)" value={x.apellidos} onChange={setFam(i, "apellidos")} />
              <Field label="Nombre(s)" value={x.nombres} onChange={setFam(i, "nombres")} />
              <Field label="Tipo de documento" value={x.tipoDocumento} onChange={setFam(i, "tipoDocumento")} options={TIPOS_DOCUMENTO} />
              <Field label="Número de documento" value={x.numeroDocumento} onChange={setFam(i, "numeroDocumento")} />
              <Field label="CUIL" value={x.cuil} onChange={setFam(i, "cuil")} placeholder="20-12345678-9" />
              <Field label="Fecha de nacimiento" type="date" value={x.fechaNacimiento} onChange={setFam(i, "fechaNacimiento")} />
              <Field label="Vínculo o parentesco" value={x.vinculo} onChange={setFam(i, "vinculo")} options={VINCULOS} span={2} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10 }}>
              <Casilla label="A cargo del trabajador" checked={x.aCargo} onChange={setFam(i, "aCargo")} />
              <Casilla label="Genera asignaciones familiares" checked={x.asignaciones} onChange={setFam(i, "asignaciones")} />
              <Casilla label="Cobertura de obra social" checked={x.obraSocial} onChange={setFam(i, "obraSocial")} />
              <Casilla label="Convive con el trabajador" checked={x.convive} onChange={setFam(i, "convive")} />
              <Casilla label="Discapacidad (CUD)" checked={x.discapacidad} onChange={setFam(i, "discapacidad")} />
            </div>
            {(x.discapacidad || esHijo) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                {x.discapacidad && <Field label="Vencimiento del CUD" type="date" value={x.cudVencimiento} onChange={setFam(i, "cudVencimiento")} span={esHijo ? 1 : 2} />}
                {esHijo && <Field label="Nivel escolar" value={x.nivelEscolar} onChange={setFam(i, "nivelEscolar")} options={NIVELES_ESCOLARES} span={x.discapacidad ? 1 : 2} />}
                {esHijo && x.nivelEscolar && x.nivelEscolar !== "No escolarizado" && (
                  <Field label="Año del último certificado de escolaridad" type="number" value={x.certificadoEscolarAnio} onChange={setFam(i, "certificadoEscolarAnio")} placeholder={String(anioActual)} span={2} />
                )}
              </div>
            )}
            {(certViejo || cudVencido) && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {certViejo && <Pill bg={C.orangeLight} fg={C.orange}>Falta certificado de escolaridad {anioActual}</Pill>}
                {cudVencido && <Pill bg={C.redLight} fg={C.red}>CUD vencido</Pill>}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginBottom: 18 }}>
        <Btn tone="ghost" icon={Plus} onClick={() => setFams([...fams, FAMILIAR_VACIO()])} full>Agregar familiar</Btn>
      </div>

      {seccion("7. Designación de beneficiarios (seguro de vida / fallecimiento)")}
      {nota("En caso de fallecimiento del trabajador, las indemnizaciones, seguros de vida vigentes y/o haberes devengados pendientes se distribuirán entre las siguientes personas según los porcentajes indicados. La suma debe ser estrictamente 100%.")}
      {bs.map((b, i) => (
        <div key={i} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Beneficiario {i + 1}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Nombre completo" value={b.nombre} onChange={setBen(i, "nombre")} span={2} />
            <Field label="DNI / Documento" value={b.dni} onChange={setBen(i, "dni")} />
            <Field label="Parentesco" value={b.parentesco} onChange={setBen(i, "parentesco")} />
            <Field label="Fecha de nacimiento" type="date" value={b.fechaNacimiento} onChange={setBen(i, "fechaNacimiento")} />
            <Field label="Teléfono" value={b.telefono} onChange={setBen(i, "telefono")} />
            <Field label="Porcentaje asignado (%)" type="number" value={b.porcentaje} onChange={setBen(i, "porcentaje")} span={2} />
          </div>
        </div>
      ))}
      {cargados.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <Pill bg={Math.abs(suma - 100) < 0.001 ? C.greenLight : C.redLight} fg={Math.abs(suma - 100) < 0.001 ? C.green : C.red}>
            Suma de porcentajes: {suma}% {Math.abs(suma - 100) < 0.001 ? "✓" : "— debe ser 100%"}
          </Pill>
        </div>
      )}

      {seccion("8. Declaración jurada y firma")}
      {nota("Declaro bajo juramento que todos los datos asentados en este formulario son correctos, completos y fiel expresión de la verdad. Me comprometo a notificar formalmente a la empresa cualquier cambio que ocurra en la información aquí brindada en un plazo no mayor a 30 días.")}
      <div style={grid}>
        <Field label="Ciudad de firma" value={l.declaracionCiudad} onChange={setLeg("declaracionCiudad")} />
        <Field label="Fecha de firma" type="date" value={l.declaracionFecha} onChange={setLeg("declaracionFecha")} />
        <div style={{ gridColumn: "span 2", fontSize: 11, color: C.inkSoft }}>La firma se realiza en papel. Registrá acá la fecha en que el trabajador firmó.</div>
      </div>

      {intento && errores.length > 0 && (
        <div style={{ background: C.redLight, color: C.red, borderRadius: 10, padding: 10, fontSize: 12, marginBottom: 12 }}>
          {errores.map((e, i) => <div key={i}>• {e}</div>)}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} onClick={guardar} full>Guardar legajo</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── HABILITACIONES TAB ─────────────────────────── */
function HabilitacionesTab({ empleados, setEmpleados, canEdit }) {
  const [editing, setEditing] = useState(null);
  function save(form) {
    setEmpleados(empleados.map((e) => (e.id === form.id ? form : e)));
    setEditing(null);
  }
  return (
    <div>
      <SectionTitle icon={BadgeCheck} title="Habilitaciones PNA" subtitle="Libreta de Embarco, título y vencimientos" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {empleados.map((e) => {
          const t = expiryTone(e.vencHabilitacion);
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(e)} title="Editar" />}
              </div>
              <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 6 }}>
                Libreta: {e.libretaEmbarco || "—"}
              </div>
              <Pill bg={t.bg} fg={t.fg}>{t.label}</Pill>
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title={`Habilitación — ${editing.apellido}`} onClose={() => setEditing(null)}>
          <HabForm emp={editing} onCancel={() => setEditing(null)} onSave={save} />
        </Modal>
      )}
    </div>
  );
}
function HabForm({ emp, onCancel, onSave }) {
  const [f, setF] = useState(emp);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Field label="N° Libreta de Embarco" value={f.libretaEmbarco} onChange={set("libretaEmbarco")} span={2} />
        <Field label="Venc. Libreta" type="date" value={f.vencLibreta} onChange={set("vencLibreta")} />
        <Field label="Venc. Habilitación" type="date" value={f.vencHabilitacion} onChange={set("vencHabilitacion")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── MÉDICOS TAB ─────────────────────────── */
function MedicosTab({ empleados, setEmpleados, canEdit, examenesSRT, setExamenesSRT }) {
  const [editing, setEditing] = useState(null);
  const [verSRT, setVerSRT] = useState(null);
  function save(form) {
    setEmpleados(empleados.map((e) => (e.id === form.id ? form : e)));
    setEditing(null);
  }
  return (
    <div>
      <SectionTitle icon={HeartPulse} title="Certificados Médicos PNA" subtitle="Aptitud psicofísica REGINAVE" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {empleados.map((e) => {
          const t = expiryTone(e.vencCertMedico);
          const cantSRT = examenesSRT.filter((x) => x.empleadoId === e.id).length;
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>Vence: {fmtDate(e.vencCertMedico)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Pill bg={t.bg} fg={t.fg}>{t.label}</Pill>
                  {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(e)} title="Editar" />}
                </div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setVerSRT(e)} style={{
                  background: "transparent", border: "none", color: C.navy, fontSize: 11.5, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0,
                }}>
                  <ClipboardList size={14} />
                  Exámenes Ley 24.557 / SRT ({cantSRT})
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title={`Cert. Médico — ${editing.apellido}`} onClose={() => setEditing(null)}>
          <div style={{ marginBottom: 14 }}>
            <Field label="Vencimiento Cert. Médico" type="date" value={editing.vencCertMedico}
              onChange={(v) => setEditing({ ...editing, vencCertMedico: v })} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn tone="ghost" onClick={() => setEditing(null)} full>Cancelar</Btn>
            <Btn tone="primary" icon={Save} onClick={() => save(editing)} full>Guardar</Btn>
          </div>
        </Modal>
      )}
      {verSRT && (
        <Modal title={`Exámenes SRT — ${verSRT.apellido}, ${verSRT.nombre}`} onClose={() => setVerSRT(null)} wide>
          <ExamenesSRTPanel empleado={verSRT} items={examenesSRT.filter((x) => x.empleadoId === verSRT.id)}
            setItems={setExamenesSRT} allItems={examenesSRT} canEdit={canEdit} />
        </Modal>
      )}
    </div>
  );
}

function ExamenesSRTPanel({ empleado, items, setItems, allItems, canEdit }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [descargando, setDescargando] = useState(null);
  const [errorArchivo, setErrorArchivo] = useState("");

  async function add(form, file) {
    setErrorArchivo("");
    let archivoPath = "", archivoNombre = "";
    if (file) {
      const res = await subirArchivoExamen(empleado.id, file);
      if (res.error) { setErrorArchivo("No se pudo subir el archivo: " + res.error); return; }
      archivoPath = res.path; archivoNombre = res.nombre;
    }
    const nuevo = { ...form, empleadoId: empleado.id, id: uid("SRT"), archivoPath, archivoNombre };
    setItems([nuevo, ...allItems]);
    setAdding(false);
  }

  async function saveEdit(form, file, original) {
    setErrorArchivo("");
    let archivoPath = original.archivoPath, archivoNombre = original.archivoNombre;
    if (file) {
      const res = await subirArchivoExamen(empleado.id, file);
      if (res.error) { setErrorArchivo("No se pudo subir el archivo: " + res.error); return; }
      if (original.archivoPath) await borrarArchivoExamen(original.archivoPath);
      archivoPath = res.path; archivoNombre = res.nombre;
    }
    const actualizado = { ...original, ...form, archivoPath, archivoNombre };
    setItems(allItems.map((i) => (i.id === original.id ? actualizado : i)));
    setEditing(null);
  }

  async function remove(item) {
    if (item.archivoPath) await borrarArchivoExamen(item.archivoPath);
    setItems(allItems.filter((i) => i.id !== item.id));
  }

  async function descargar(item) {
    if (!item.archivoPath) return;
    setDescargando(item.id);
    const res = await descargarArchivoExamen(item.archivoPath);
    setDescargando(null);
    if (res.error) { setErrorArchivo("No se pudo generar la descarga: " + res.error); return; }
    window.open(res.url, "_blank");
  }

  return (
    <div>
      {canEdit && !adding && !editing && (
        <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)} full>Nuevo examen</Btn>
      )}
      {errorArchivo && (
        <div style={{ color: C.red, fontSize: 12, background: C.redLight, padding: 8, borderRadius: 8, marginTop: 10 }}>{errorArchivo}</div>
      )}
      {adding && <ExamenSRTForm onCancel={() => setAdding(false)} onSave={add} />}
      {editing && (
        <ExamenSRTForm initial={editing} onCancel={() => setEditing(null)}
          onSave={(form, file) => saveEdit(form, file, editing)} />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {items.map((it) => (
          <div key={it.id} style={{ background: C.bg, borderRadius: 10, padding: 11, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <Pill bg={C.celesteLight} fg={C.navy}>{it.tipo}</Pill>
                  {it.resultado && <Pill bg={it.resultado === "No Apto" ? C.redLight : C.greenLight} fg={it.resultado === "No Apto" ? C.red : C.green}>{it.resultado}</Pill>}
                  {!it.archivoPath && <Pill bg={C.orangeLight} fg={C.orange}>Sin PDF</Pill>}
                </div>
                <div style={{ fontSize: 12, color: C.ink }}>Fecha: {fmtDate(it.fecha)}</div>
                {it.proximoVencimiento && <div style={{ fontSize: 11.5, color: C.inkSoft }}>Próximo: {fmtDate(it.proximoVencimiento)}</div>}
                {it.notas && <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>{it.notas}</div>}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {it.archivoPath && (
                  <IconBtn icon={Eye} tone="primary" onClick={() => descargar(it)}
                    title={descargando === it.id ? "Generando enlace…" : `Descargar ${it.archivoNombre || "PDF"}`} />
                )}
                {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(it)} title={it.archivoPath ? "Editar / reemplazar PDF" : "Editar / adjuntar PDF"} />}
                {canEdit && <IconBtn icon={Trash2} tone="danger" onClick={() => remove(it)} title="Eliminar" />}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <EmptyState icon={ClipboardList} text="Sin exámenes cargados todavía." />}
      </div>
    </div>
  );
}

function ExamenSRTForm({ initial, onCancel, onSave }) {
  const [f, setF] = useState(initial
    ? { tipo: initial.tipo, fecha: initial.fecha, resultado: initial.resultado || "Apto", proximoVencimiento: initial.proximoVencimiento || "", notas: initial.notas || "" }
    : { tipo: "Periódico", fecha: todayISO(), resultado: "Apto", proximoVencimiento: "", notas: "" });
  const [file, setFile] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  async function handleSave() {
    setGuardando(true);
    await onSave(f, file);
    setGuardando(false);
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 13, marginTop: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Field label="Tipo de examen" value={f.tipo} onChange={set("tipo")} options={TIPOS_EXAMEN_SRT} />
        <Field label="Resultado" value={f.resultado} onChange={set("resultado")} options={RESULTADOS_EXAMEN_SRT} />
        <Field label="Fecha" type="date" value={f.fecha} onChange={set("fecha")} />
        <Field label="Próximo vencimiento" type="date" value={f.proximoVencimiento} onChange={set("proximoVencimiento")} />
        <Field label="Notas (opcional)" value={f.notas} onChange={set("notas")} span={2} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 5 }}>
          {initial?.archivoPath ? `PDF actual: ${initial.archivoNombre || "archivo cargado"} — subir uno nuevo lo reemplaza` : "PDF del resultado (opcional)"}
        </div>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0] || null)}
          style={{ fontSize: 12.5, width: "100%" }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={guardando} onClick={handleSave} full>{guardando ? "Guardando…" : "Guardar"}</Btn>
      </div>
    </div>
  );
}

function CapacitacionTab({ empleados, items, setItems, canEdit }) {
  const [adding, setAdding] = useState(false);
  function add(form) { setItems([{ ...form, id: uid("CAP") }, ...items]); setAdding(false); }
  function remove(id) { setItems(items.filter((i) => i.id !== id)); }
  return (
    <div>
      <SectionTitle icon={GraduationCap} title="Capacitación REGINAVE" subtitle={`${items.length} cursos registrados`}
        action={canEdit && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nuevo</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => {
          const t = expiryTone(it.fVencimiento);
          return (
            <div key={it.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{it.curso}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{empName(empleados, it.empleadoId)} · Realizado {fmtDate(it.fRealizacion)}</div>
                </div>
                {canEdit && <IconBtn icon={Trash2} tone="danger" onClick={() => remove(it.id)} title="Eliminar" />}
              </div>
              <div style={{ marginTop: 8 }}><Pill bg={t.bg} fg={t.fg}>{it.fVencimiento ? t.label : "Sin vencimiento"}</Pill></div>
            </div>
          );
        })}
        {items.length === 0 && <EmptyState icon={GraduationCap} text="Sin cursos registrados." />}
      </div>
      {adding && (
        <Modal title="Nuevo curso" onClose={() => setAdding(false)}>
          <CapForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} />
        </Modal>
      )}
    </div>
  );
}
function CapForm({ empleados, onCancel, onSave }) {
  const [f, setF] = useState({ empleadoId: "", curso: "", fRealizacion: todayISO(), fVencimiento: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.curso;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Curso" value={f.curso} onChange={set("curso")} options={CURSOS_REGINAVE} span={2} />
        <Field label="Fecha de realización" type="date" value={f.fRealizacion} onChange={set("fRealizacion")} />
        <Field label="Fecha de vencimiento" type="date" value={f.fVencimiento} onChange={set("fVencimiento")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── DOTACIÓN TAB (referencia estática + flota real) ─────────────────────────── */
function DotacionTab({ empleados, embarcaciones }) {
  const flotaActiva = (embarcaciones || []).filter((b) => b.estado === "Activa");
  return (
    <div>
      <SectionTitle icon={Anchor} title="Dotación Mínima Segura" subtitle="Tabla normativa PNA / REGINAVE" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {DOTACION_REF.map((r, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 4 }}>{r[0]}</div>
            <div style={{ fontSize: 11.5, color: C.inkSoft, marginBottom: 6 }}>{r[1]}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <Pill bg={C.celesteLight} fg={C.navy}>{r[2]}</Pill>
              <Pill bg={C.celesteLight} fg={C.navy}>{r[3]}</Pill>
              <Pill bg={C.celesteLight} fg={C.navy}>{r[4]}</Pill>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Tripulación asignada actual</div>
      {flotaActiva.length === 0 && (
        <EmptyState icon={Anchor} text="No hay embarcaciones activas cargadas. Andá a la pestaña Embarcaciones." />
      )}
      {flotaActiva.map((b) => {
        const list = empleados.filter((e) => e.lancha === b.nombre && e.estado !== "Baja");
        return (
        <div key={b.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 6 }}>{b.nombre} · {list.length} tripulantes</div>
          {list.length === 0 ? (
            <div style={{ fontSize: 11.5, color: C.inkSoft }}>Sin asignaciones cargadas.</div>
          ) : list.map((e) => (
            <div key={e.id} style={{ fontSize: 12, color: C.ink, padding: "4px 0" }}>
              {e.apellido}, {e.nombre} — {e.cargo || "sin cargo"}
            </div>
          ))}
        </div>
        );
      })}
      <div style={{ marginTop: 4, padding: 12, background: C.yellowLight, borderRadius: 10, fontSize: 11.5, color: "#6B5A0A" }}>
        La lancha no puede zarpar por debajo de la dotación mínima reglamentaria (Punto 22 del Reglamento). Verificar cargo y categoría antes del servicio.
      </div>
    </div>
  );
}

/* ─────────────────────────── EMBARCOS TAB ─────────────────────────── */
function EmbarcosTab({ empleados, items, setItems, canEdit, embarcaciones }) {
  const [adding, setAdding] = useState(false);
  function add(form) { setItems([{ ...form, id: uid("EMB") }, ...items]); setAdding(false); }
  function remove(id) { setItems(items.filter((i) => i.id !== id)); }
  return (
    <div>
      <SectionTitle icon={Ship} title="Control de Embarcos" subtitle={`${items.length} registros`}
        action={canEdit && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nuevo</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => (
          <div key={it.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{empName(empleados, it.empleadoId)}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>
                  {it.lancha} · {fmtDate(it.fEmbarco)} → {it.fDesembarco ? fmtDate(it.fDesembarco) : "en curso"}
                </div>
              </div>
              {canEdit && <IconBtn icon={Trash2} tone="danger" onClick={() => remove(it.id)} title="Eliminar" />}
            </div>
          </div>
        ))}
        {items.length === 0 && <EmptyState icon={Ship} text="Sin embarcos registrados." />}
      </div>
      {adding && (
        <Modal title="Nuevo embarco" onClose={() => setAdding(false)}>
          <EmbarcoForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} embarcaciones={embarcaciones} />
        </Modal>
      )}
    </div>
  );
}
function EmbarcoForm({ empleados, onCancel, onSave, embarcaciones }) {
  const [f, setF] = useState({ empleadoId: "", lancha: "", fEmbarco: todayISO(), fDesembarco: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.lancha;
  const lanchaOpciones = (embarcaciones || []).filter((b) => b.estado === "Activa").map((b) => b.nombre);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Lancha" value={f.lancha} onChange={set("lancha")} options={lanchaOpciones} span={2} />
        <Field label="Fecha embarco" type="date" value={f.fEmbarco} onChange={set("fEmbarco")} />
        <Field label="Fecha desembarco" type="date" value={f.fDesembarco} onChange={set("fDesembarco")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── REGLAMENTO TAB ─────────────────────────── */
function ReglamentoTab() {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(null);
  const filtered = REGLAMENTO_22.filter((r) => r.obligacion.toLowerCase().includes(q.toLowerCase()));
  const gravedadTone = (g) => {
    if (g.includes("CERO TOLER")) return { bg: C.redLight, fg: C.red };
    if (g.includes("MUY GRAVE")) return { bg: C.redLight, fg: C.red };
    if (g.includes("GRAVE")) return { bg: C.orangeLight, fg: C.orange };
    return { bg: C.greenLight, fg: C.green };
  };
  const pre = { whiteSpace: "pre-line" };
  return (
    <div>
      <SectionTitle icon={ScrollText} title="Reglamento — 22 Puntos" subtitle="Texto oficial íntegro, sin modificaciones" />
      <SearchBox q={q} setQ={setQ} placeholder="Buscar en el reglamento…" />
      <div style={{ background: C.celesteLight, color: C.navy, padding: 10, borderRadius: 10, fontSize: 11, marginBottom: 12, display: "flex", gap: 8 }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
        Redacción textual del Reglamento Interno REGINAVE (Rev.02, Puntos 1–22). Tocá un punto para ver el detalle completo.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((r) => {
          const t = gravedadTone(r.gravedad);
          const isOpen = expanded === r.n;
          return (
            <div key={r.n} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
              <button onClick={() => setExpanded(isOpen ? null : r.n)} style={{
                width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: 13,
              }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: C.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
                    {r.n}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, color: C.ink, lineHeight: 1.4, ...pre, ...(isOpen ? {} : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>
                      {r.obligacion}
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap", alignItems: "center" }}>
                      <Pill bg={t.bg} fg={t.fg}>{r.gravedad}</Pill>
                      <Pill bg={C.celesteLight} fg={C.navy}>PNA: {r.pna.replace(/\n/g, " ")}</Pill>
                      {isOpen ? <ChevronDown size={14} color={C.inkSoft} /> : <ChevronRight size={14} color={C.inkSoft} />}
                    </div>
                  </div>
                </div>
              </button>
              {isOpen && (
                <div style={{ padding: "0 13px 14px 49px", display: "flex", flexDirection: "column", gap: 10 }}>
                  <FieldBlock label="Norma de referencia (REGINAVE/PNA)" value={r.norma} />
                  <FieldBlock label="Tipo de falta" value={r.tipoFalta} />
                  <FieldBlock label="Sanción — 1ª infracción" value={r.sancion1} tone={C.orange} />
                  <FieldBlock label="Sanción — reincidencia" value={r.sancionR} tone={C.red} />
                  <FieldBlock label="Notificación a PNA" value={r.pna} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState icon={ScrollText} text="Sin resultados." />}
      </div>
    </div>
  );
}
function FieldBlock({ label, value, tone }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.inkSoft, marginBottom: 3, letterSpacing: 0.2 }}>{label}</div>
      <div style={{ fontSize: 12, color: tone || C.ink, whiteSpace: "pre-line", lineHeight: 1.45, fontWeight: tone ? 700 : 400 }}>{value}</div>
    </div>
  );
}
function SancionesTab({ empleados, items, setItems, canEdit }) {
  const [adding, setAdding] = useState(false);
  function add(form) { setItems([{ ...form, id: uid("SAN"), estado: "Abierto" }, ...items]); setAdding(false); }
  function toggleEstado(id) {
    setItems(items.map((i) => i.id === id ? { ...i, estado: i.estado === "Abierto" ? "Cerrado" : "Abierto" } : i));
  }
  function remove(id) { setItems(items.filter((i) => i.id !== id)); }
  const tipoTone = (t) => t.includes("Baja") ? { bg: C.redLight, fg: C.red } : t.includes("Suspensión") ? { bg: C.orangeLight, fg: C.orange } : { bg: C.yellowLight, fg: C.yellow };

  return (
    <div>
      <SectionTitle icon={FileWarning} title="Registro de Sanciones" subtitle={`${items.length} registros`}
        action={canEdit && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nueva</Btn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((it) => {
          const t = tipoTone(it.tipoSancion);
          return (
            <div key={it.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{empName(empleados, it.empleadoId)}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, margin: "4px 0" }}>
                    Pto. {it.puntoReglamento} · {fmtDate(it.fecha)}
                  </div>
                  <div style={{ fontSize: 12, color: C.ink }}>{it.descripcion}</div>
                </div>
                {canEdit && <IconBtn icon={Trash2} tone="danger" onClick={() => remove(it.id)} title="Eliminar" />}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
                <Pill bg={t.bg} fg={t.fg}>{it.tipoSancion}</Pill>
                <button onClick={() => canEdit && toggleEstado(it.id)} style={{ border: "none", background: "transparent", cursor: canEdit ? "pointer" : "default" }}>
                  <Pill bg={it.estado === "Abierto" ? C.orangeLight : C.greenLight} fg={it.estado === "Abierto" ? C.orange : C.green}>{it.estado}</Pill>
                </button>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <EmptyState icon={FileWarning} text="Sin sanciones registradas." />}
      </div>
      {adding && (
        <Modal title="Nueva sanción" onClose={() => setAdding(false)}>
          <SancionForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} />
        </Modal>
      )}
    </div>
  );
}
function SancionForm({ empleados, onCancel, onSave }) {
  const [f, setF] = useState({ empleadoId: "", puntoReglamento: "", descripcion: "", tipoSancion: "", fecha: todayISO() });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.tipoSancion && f.descripcion;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Punto del Reglamento (1-22)" value={f.puntoReglamento} onChange={set("puntoReglamento")}
          options={REGLAMENTO_22.map((r) => String(r.n))} />
        <Field label="Fecha" type="date" value={f.fecha} onChange={set("fecha")} />
        <Field label="Tipo de sanción" value={f.tipoSancion} onChange={set("tipoSancion")} options={TIPOS_SANCION} span={2} />
        <div style={{ gridColumn: "span 2" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 4 }}>Descripción de la falta</div>
          <textarea value={f.descripcion} onChange={(e) => set("descripcion")(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────── INCIDENTES TAB ─────────────────────────── */
function IncidentesTab({ empleados, items, setItems, canEdit }) {
  const [sub, setSub] = useState("llegada");
  const [adding, setAdding] = useState(false);
  const filtered = items.filter((i) => i.tipo === sub);

  function add(form) { setItems([{ ...form, id: uid("INC"), tipo: sub }, ...items]); setAdding(false); }
  function remove(id) { setItems(items.filter((i) => i.id !== id)); }

  return (
    <div>
      <SectionTitle icon={AlertTriangle} title="Incidentes Operativos" subtitle="Puntos 21 y 22 del Reglamento"
        action={canEdit && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nuevo</Btn>} />
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setSub("llegada")} style={{
          flex: 1, padding: "9px 10px", borderRadius: 9, border: `1.5px solid ${sub === "llegada" ? C.navy : C.border}`,
          background: sub === "llegada" ? C.navy : "#fff", color: sub === "llegada" ? "#fff" : C.ink, fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>Pto.21 · Llegada tardía</button>
        <button onClick={() => setSub("dotacion")} style={{
          flex: 1, padding: "9px 10px", borderRadius: 9, border: `1.5px solid ${sub === "dotacion" ? C.navy : C.border}`,
          background: sub === "dotacion" ? C.navy : "#fff", color: sub === "dotacion" ? "#fff" : C.ink, fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>Pto.22 · Sin dotación</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((it) => (
          <div key={it.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{empName(empleados, it.empleadoId)}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, margin: "4px 0" }}>{fmtDate(it.fecha)}</div>
                {sub === "llegada" ? (
                  <div style={{ fontSize: 12, color: C.ink }}>{it.minutos} min. de demora · Aviso previo: {it.avisoPrevio}</div>
                ) : (
                  <div style={{ fontSize: 12, color: C.ink }}>Faltante: {it.cargoFaltante} · {it.detalle}</div>
                )}
              </div>
              {canEdit && <IconBtn icon={Trash2} tone="danger" onClick={() => remove(it.id)} title="Eliminar" />}
            </div>
            <div style={{ marginTop: 8 }}>
              <Pill bg={sub === "dotacion" ? C.redLight : C.orangeLight} fg={sub === "dotacion" ? C.red : C.orange}>
                {sub === "dotacion" ? "CERO TOLERANCIA" : "GRAVE"}
              </Pill>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState icon={AlertTriangle} text="Sin incidentes registrados en esta categoría." />}
      </div>
      {adding && (
        <Modal title={sub === "llegada" ? "Nueva llegada tardía" : "Zarpe sin dotación mínima"} onClose={() => setAdding(false)}>
          {sub === "llegada"
            ? <LlegadaForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} />
            : <DotacionForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} />}
        </Modal>
      )}
    </div>
  );
}
function LlegadaForm({ empleados, onCancel, onSave }) {
  const [f, setF] = useState({ empleadoId: "", fecha: todayISO(), minutos: "", avisoPrevio: "No" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.minutos;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Fecha" type="date" value={f.fecha} onChange={set("fecha")} />
        <Field label="Minutos de demora" type="number" value={f.minutos} onChange={set("minutos")} />
        <Field label="Aviso previo" value={f.avisoPrevio} onChange={set("avisoPrevio")} options={["Sí", "No"]} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
    </div>
  );
}
function DotacionForm({ empleados, onCancel, onSave }) {
  const [f, setF] = useState({ empleadoId: "", fecha: todayISO(), cargoFaltante: "", detalle: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.cargoFaltante;
  return (
    <div>
      <div style={{ fontSize: 11.5, color: C.red, background: C.redLight, padding: 10, borderRadius: 9, marginBottom: 12 }}>
        Patrón responsable del zarpe. Se notifica automáticamente como falta CERO TOLERANCIA.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Fecha" type="date" value={f.fecha} onChange={set("fecha")} />
        <Field label="Cargo faltante" value={f.cargoFaltante} onChange={set("cargoFaltante")} options={CARGOS} span={2} />
        <div style={{ gridColumn: "span 2" }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: C.inkSoft, marginBottom: 4 }}>Detalle / motivo alegado</div>
          <textarea value={f.detalle} onChange={(e) => set("detalle")(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="danger" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Registrar</Btn>
      </div>
    </div>
  );
}
function EvaluacionTab({ empleados, onSave, canEdit }) {
  const [empleadoId, setEmpleadoId] = useState("");
  const [evaluador, setEvaluador] = useState("");
  const [scores, setScores] = useState(Object.fromEntries(CRITERIOS.map((c) => [c.key, 3])));
  const [saved, setSaved] = useState(false);
  const [showTabla, setShowTabla] = useState(false);

  const grupos = useMemo(() => groupByArea(CRITERIOS), []);

  const puntaje = useMemo(() => {
    const suma = CRITERIOS.reduce((sum, c) => sum + scores[c.key] * c.pond, 0);
    return suma / TOTAL_POND;
  }, [scores]);
  const v = veredicto(puntaje);

  function save() {
    onSave({
      id: uid("EVAL"), empleadoId, evaluador, fecha: todayISO(),
      puntaje: puntaje.toFixed(2), veredicto: v.text, scores,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
    setEmpleadoId(""); setEvaluador("");
    setScores(Object.fromEntries(CRITERIOS.map((c) => [c.key, 3])));
  }

  const TablaVeredictos = (
    <div style={{ background: C.card, borderRadius: 13, border: `1px solid ${C.border}`, marginBottom: 14, overflow: "hidden" }}>
      <button onClick={() => setShowTabla(!showTabla)} style={{
        width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer",
        padding: 13, display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Tabla de veredictos formales (texto oficial)</span>
        {showTabla ? <ChevronDown size={15} color={C.inkSoft} /> : <ChevronRight size={15} color={C.inkSoft} />}
      </button>
      {showTabla && (
        <div style={{ padding: "0 13px 13px", display: "flex", flexDirection: "column", gap: 8 }}>
          {VEREDICTOS_TABLA.map((row) => {
            const c = VEREDICTO_COLORS[row.veredicto];
            return (
              <div key={row.veredicto} style={{ background: c.bg, borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: c.fg }}>{row.rango}</span>
                  <Pill bg="#fff" fg={c.fg}>{row.categoria}</Pill>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.fg, marginBottom: 3 }}>{row.veredicto}</div>
                <div style={{ fontSize: 11, color: c.fg, lineHeight: 1.4 }}>{row.accion}</div>
                <div style={{ fontSize: 10, color: c.fg, opacity: 0.75, marginTop: 4 }}>Ref: {row.ref}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (!canEdit) {
    return (
      <div>
        <SectionTitle icon={ClipboardList} title="Evaluación de Personal" subtitle="Solo RRHH/Presidencia puede cargar evaluaciones" />
        {TablaVeredictos}
        <EmptyState icon={Eye} text="Consultá los resultados guardados en la pestaña Historial de Evaluaciones." />
      </div>
    );
  }

  return (
    <div>
      <SectionTitle icon={ClipboardList} title="Evaluación de Personal" subtitle="Formulario REGINAVE/PNA — 20 criterios ponderados" />
      {saved && (
        <div style={{ background: C.greenLight, color: C.green, padding: 10, borderRadius: 10, fontSize: 12.5, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          <CheckCircle2 size={15} /> Evaluación guardada
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <EmpPicker value={empleadoId} onChange={setEmpleadoId} empleados={empleados} />
        <Field label="Evaluador" value={evaluador} onChange={setEvaluador} span={2} placeholder="Nombre del Patrón / Capitán" />
      </div>

      {TablaVeredictos}

      <div style={{ fontSize: 11, color: C.inkSoft, marginBottom: 8, fontWeight: 700 }}>
        Escala: 1=Deficiente · 2=Regular · 3=Bueno · 4=Muy Bueno · 5=Excelente
      </div>

      {grupos.map((g) => (
        <div key={g.area} style={{ background: C.card, borderRadius: 13, padding: 14, border: `1px solid ${C.border}`, marginBottom: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: C.gold, marginBottom: 12, letterSpacing: 0.3 }}>{g.area}</div>
          {g.items.map((c) => (
            <div key={c.key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{c.criterio}</span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, flexShrink: 0 }}>{scores[c.key]}</span>
              </div>
              <div style={{ fontSize: 10, color: C.inkSoft, marginBottom: 6 }}>
                Ponderación {(c.pond * 100).toFixed(0)}% · Ref: {c.norma}
              </div>
              <input type="range" min={1} max={5} step={1} value={scores[c.key]}
                onChange={(e) => setScores({ ...scores, [c.key]: Number(e.target.value) })}
                style={{ width: "100%", accentColor: C.navy }} />
            </div>
          ))}
        </div>
      ))}

      <div style={{ background: v.bg, borderRadius: 13, padding: 16, textAlign: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: v.fg }}>{puntaje.toFixed(2)}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: v.fg, marginTop: 2 }}>{v.categoria} · {v.veredicto}</div>
        <div style={{ fontSize: 11, color: v.fg, marginTop: 6, lineHeight: 1.4 }}>{v.accion}</div>
      </div>

      <div style={{ background: C.goldLight, color: "#6B5A0A", padding: 10, borderRadius: 10, fontSize: 10.5, lineHeight: 1.4, marginBottom: 16 }}>
        {NOTA_LEGAL_EVAL}
      </div>

      <Btn tone="primary" icon={Save} disabled={!empleadoId || !evaluador} onClick={save} full>
        Guardar evaluación
      </Btn>
    </div>
  );
}

/* ─────────────────────────── HISTORIAL TAB ─────────────────────────── */
function HistorialTab({ empleados, items }) {
  const [q, setQ] = useState("");
  const filtered = items.filter((i) => empName(empleados, i.empleadoId).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionTitle icon={Clock} title="Historial de Evaluaciones" subtitle={`${items.length} evaluaciones registradas`} />
      <SearchBox q={q} setQ={setQ} placeholder="Buscar por tripulante…" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((it) => {
          const v = veredicto(Number(it.puntaje));
          return (
            <div key={it.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{empName(empleados, it.empleadoId)}</div>
                  <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{fmtDate(it.fecha)} · Evaluador: {it.evaluador}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: v.fg }}>{it.puntaje}</div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}><Pill bg={v.bg} fg={v.fg}>{it.veredicto}</Pill></div>
            </div>
          );
        })}
        {filtered.length === 0 && <EmptyState icon={Clock} text="Sin evaluaciones registradas todavía." />}
      </div>
    </div>
  );
}

/* ─────────────────────────── NÓMINA Y CCT TAB (solo RRHH) ─────────────────────────── */
function NominaCCTTab({ empleados, items, setItems, canEdit }) {
  const [editing, setEditing] = useState(null);
  const map = Object.fromEntries(items.map((i) => [i.empleadoId, i]));

  function save(form) {
    const exists = items.some((i) => i.empleadoId === form.empleadoId);
    setItems(exists ? items.map((i) => (i.empleadoId === form.empleadoId ? form : i)) : [...items, form]);
    setEditing(null);
  }

  return (
    <div>
      <SectionTitle icon={DollarSign} title="Nómina y CCT" subtitle="Información salarial — acceso restringido a RRHH" />
      <div style={{ background: C.orangeLight, color: C.orange, padding: 10, borderRadius: 10, fontSize: 11.5, marginBottom: 12, display: "flex", gap: 8 }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        Esta información es sensible. Solo la ven RRHH y Presidencia.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {empleados.map((e) => {
          const n = map[e.id];
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>
                  {n ? `${n.categoriaCCT || "—"} · Básico $${Number(n.salarioBasico || 0).toLocaleString("es-AR")}${n.cbu ? ` · CBU ${maskCBU(n.cbu)}` : ""}` : "Sin datos cargados"}
                </div>
              </div>
              {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(n || { empleadoId: e.id, categoriaCCT: "", salarioBasico: "", cbu: "" })} title="Editar" />}
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title={`Nómina — ${empName(empleados, editing.empleadoId)}`} onClose={() => setEditing(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Field label="Categoría CCT" value={editing.categoriaCCT} onChange={(v) => setEditing({ ...editing, categoriaCCT: v })} />
            <Field label="Salario básico ($)" type="number" value={editing.salarioBasico} onChange={(v) => setEditing({ ...editing, salarioBasico: v })} />
            <Field label="CBU / cuenta bancaria para pago" value={editing.cbu || ""} onChange={(v) => setEditing({ ...editing, cbu: v })} span={2} placeholder="22 dígitos" />
            {!cbuValido(editing.cbu) && <div style={{ gridColumn: "span 2", color: C.red, fontSize: 11.5 }}>El CBU debe tener exactamente 22 dígitos.</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn tone="ghost" onClick={() => setEditing(null)} full>Cancelar</Btn>
            <Btn tone="primary" icon={Save} disabled={!cbuValido(editing.cbu)} onClick={() => save({ ...editing, cbu: (editing.cbu || "").replace(/\s/g, "") })} full>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
/* ─────────────────────────── EMBARCACIONES (alta/baja solo Presidencia) ─────────────────────────── */
const TIPOS_EMBARCACION = ["Lancha Motor", "Lancha de Prácticos", "Lancha de Prácticos - Amarre (No Simultáneo)", "Yate Motor"];
const MATERIALES_CASCO = ["Acero", "Aluminio", "PRFV", "Plástico"];

function EmbarcacionesTab({ items, setItems, isPresidente }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);

  function add(form) {
    setItems([{ ...form, id: uid("EMB-B"), estado: "Activa" }, ...items]);
    setAdding(false);
  }
  function save(form) {
    setItems(items.map((i) => (i.id === form.id ? form : i)));
    setEditing(null);
  }
  function toggleEstado(item) {
    setItems(items.map((i) => (i.id === item.id ? { ...i, estado: i.estado === "Activa" ? "Baja" : "Activa" } : i)));
  }
  function remove(id) {
    setItems(items.filter((i) => i.id !== id));
  }

  const activas = items.filter((b) => b.estado === "Activa");
  const bajas = items.filter((b) => b.estado !== "Activa");

  return (
    <div>
      <SectionTitle icon={Ship} title="Embarcaciones" subtitle={`${activas.length} activas · ${bajas.length} de baja`}
        action={isPresidente && <Btn tone="gold" icon={Plus} onClick={() => setAdding(true)}>Nueva embarcación</Btn>} />

      {!isPresidente && (
        <div style={{ background: C.celesteLight, color: C.navy, padding: 10, borderRadius: 10, fontSize: 11.5, marginBottom: 14, display: "flex", gap: 8 }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          Solo Presidencia puede dar de alta, baja o editar embarcaciones.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...activas, ...bajas].map((b) => (
          <div key={b.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, opacity: b.estado === "Baja" ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{b.nombre}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>
                  Matrícula {b.matricula || "—"} · {b.tipo || "—"}
                </div>
                <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 2 }}>
                  Eslora {b.eslora || "—"}m · {b.materialCasco || "—"} · {b.motores || "—"}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Pill bg={b.estado === "Activa" ? C.greenLight : C.redLight} fg={b.estado === "Activa" ? C.green : C.red}>
                    {b.estado}
                  </Pill>
                </div>
              </div>
              {isPresidente && (
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <IconBtn icon={Pencil} tone="primary" onClick={() => setEditing(b)} title="Editar" />
                  <IconBtn icon={b.estado === "Activa" ? XCircle : CheckCircle2} tone={b.estado === "Activa" ? "danger" : "primary"}
                    onClick={() => toggleEstado(b)} title={b.estado === "Activa" ? "Dar de baja" : "Reactivar"} />
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <EmptyState icon={Ship} text="Sin embarcaciones cargadas." />}
      </div>

      {adding && (
        <Modal title="Nueva embarcación" onClose={() => setAdding(false)} wide>
          <EmbarcacionForm onCancel={() => setAdding(false)} onSave={add} />
        </Modal>
      )}
      {editing && (
        <Modal title={`Editar — ${editing.nombre}`} onClose={() => setEditing(null)} wide>
          <EmbarcacionForm initial={editing} onCancel={() => setEditing(null)} onSave={save} onDelete={() => { remove(editing.id); setEditing(null); }} />
        </Modal>
      )}
    </div>
  );
}

function EmbarcacionForm({ initial, onCancel, onSave, onDelete }) {
  const [f, setF] = useState(initial || {
    nombre: "", matricula: "", materialCasco: "", tipo: "", explotacionEspecifica: "",
    eslora: "", manga: "", puntal: "", tonelajeTotal: "", tonelajeNeto: "", motores: "", fechaInscripcion: "",
  });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.nombre.trim().length > 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Field label="Nombre" value={f.nombre} onChange={set("nombre")} span={2} />
        <Field label="Matrícula (PNA)" value={f.matricula} onChange={set("matricula")} />
        <Field label="Fecha de inscripción" type="date" value={f.fechaInscripcion} onChange={set("fechaInscripcion")} />
        <Field label="Tipo" value={f.tipo} onChange={set("tipo")} options={TIPOS_EMBARCACION} />
        <Field label="Material del casco" value={f.materialCasco} onChange={set("materialCasco")} options={MATERIALES_CASCO} />
        <Field label="Explotación específica" value={f.explotacionEspecifica} onChange={set("explotacionEspecifica")} span={2} />
        <Field label="Eslora (m)" type="number" value={f.eslora} onChange={set("eslora")} />
        <Field label="Manga (m)" type="number" value={f.manga} onChange={set("manga")} />
        <Field label="Puntal (m)" type="number" value={f.puntal} onChange={set("puntal")} />
        <Field label="Tonelaje total" type="number" value={f.tonelajeTotal} onChange={set("tonelajeTotal")} />
        <Field label="Tonelaje neto" type="number" value={f.tonelajeNeto} onChange={set("tonelajeNeto")} />
        <Field label="Motores" value={f.motores} onChange={set("motores")} span={2} placeholder="Ej: 2x FPT Diesel 276.25 HP" />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} disabled={!valid} onClick={() => onSave(f)} full>Guardar</Btn>
      </div>
      {onDelete && (
        <div style={{ marginTop: 10 }}>
          <Btn tone="danger" icon={Trash2} onClick={onDelete} full>Eliminar definitivamente</Btn>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── AUDITORÍA (solo lectura, solo Presidencia) ─────────────────────────── */
const TABLA_LABEL = {
  empleados: "Personal", capacitaciones: "Capacitación", embarcos: "Embarcos",
  sanciones: "Sanciones", incidentes: "Incidentes", evaluaciones: "Evaluación",
  nomina_salarial: "Nómina y CCT", embarcaciones: "Embarcaciones", perfiles: "Usuarios",
};
const ACCION_META = {
  INSERT: { label: "Alta", bg: C.greenLight, fg: C.green },
  UPDATE: { label: "Edición", bg: C.celesteLight, fg: C.navy },
  DELETE: { label: "Baja", bg: C.redLight, fg: C.red },
};

function AuditoriaTab({ items, empleados }) {
  const [filtroTabla, setFiltroTabla] = useState("");
  const [verDetalle, setVerDetalle] = useState(null);

  const tablas = [...new Set(items.map((i) => i.tabla))];
  const filtrados = filtroTabla ? items.filter((i) => i.tabla === filtroTabla) : items;

  function describir(item) {
    // Intenta mostrar algo legible del registro afectado (ej. nombre del empleado)
    const datos = item.datosNuevos || item.datosAnteriores;
    if (!datos) return "";
    if (datos.apellido) return `${datos.apellido}, ${datos.nombre || ""}`;
    if (datos.nombre) return datos.nombre;
    if (datos.empleado_id) {
      const e = empleados.find((x) => x.id === datos.empleado_id);
      return e ? `${e.apellido}, ${e.nombre}` : "";
    }
    return "";
  }

  return (
    <div>
      <SectionTitle icon={Shield} title="Auditoría" subtitle={`${items.length} eventos registrados`} />

      <div style={{ background: C.celesteLight, color: C.navy, padding: 10, borderRadius: 10, fontSize: 11, marginBottom: 14, display: "flex", gap: 8 }}>
        <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        Este registro lo genera automáticamente la base de datos ante cualquier alta, edición o baja —
        nadie puede editarlo ni borrarlo desde la aplicación, ni siquiera Presidencia.
      </div>

      <div style={{ marginBottom: 12 }}>
        <select value={filtroTabla} onChange={(e) => setFiltroTabla(e.target.value)} style={inputStyle}>
          <option value="">Todas las secciones</option>
          {tablas.map((t) => <option key={t} value={t}>{TABLA_LABEL[t] || t}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtrados.map((item) => {
          const meta = ACCION_META[item.accion] || { label: item.accion, bg: C.border, fg: C.inkSoft };
          const desc = describir(item);
          return (
            <div key={item.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                    <Pill bg={meta.bg} fg={meta.fg}>{meta.label}</Pill>
                    <Pill bg={C.border} fg={C.inkSoft}>{TABLA_LABEL[item.tabla] || item.tabla}</Pill>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{item.usuarioNombre}</div>
                  {desc && <div style={{ fontSize: 12, color: C.ink, marginTop: 1 }}>{desc}</div>}
                  <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 3 }}>
                    {new Date(item.creadoEn).toLocaleString("es-AR")}
                  </div>
                </div>
                <button onClick={() => setVerDetalle(verDetalle === item.id ? null : item.id)} style={{
                  background: "transparent", border: "none", color: C.navy, fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                }}>
                  {verDetalle === item.id ? "Ocultar" : "Ver detalle"}
                </button>
              </div>
              {verDetalle === item.id && (
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {item.datosAnteriores && (
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.red, marginBottom: 3 }}>ANTES</div>
                      <pre style={{ fontSize: 10, background: C.redLight, padding: 8, borderRadius: 8, overflowX: "auto", margin: 0 }}>
                        {JSON.stringify(item.datosAnteriores, null, 2)}
                      </pre>
                    </div>
                  )}
                  {item.datosNuevos && (
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.green, marginBottom: 3 }}>DESPUÉS</div>
                      <pre style={{ fontSize: 10, background: C.greenLight, padding: 8, borderRadius: 8, overflowX: "auto", margin: 0 }}>
                        {JSON.stringify(item.datosNuevos, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtrados.length === 0 && <EmptyState icon={Shield} text="Sin eventos registrados todavía." />}
      </div>
    </div>
  );
}
