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
  DOTACION_REF, CARGOS, CATEGORIAS, CURSOS_REGINAVE, TIPOS_SANCION,
  uid, todayISO, daysUntil, expiryTone, fmtDate, age, antiguedad,
  veredicto, groupByArea, useSupabaseTable,
  iniciarSesion, cerrarSesion, restaurarSesion,
} from "./lib.js";


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
  return (
    <Field label="Tripulante" value={value} onChange={onChange}
      options={empleados.map((e) => e.id)} span={2} />
  );
}
function empName(empleados, id) {
  const e = empleados.find((x) => x.id === id);
  return e ? `${e.apellido}, ${e.nombre}` : "—";
}

/* ─────────────────────────── TOP BAR / TABS ─────────────────────────── */

/* ─────────────────────────── LOGIN (Supabase Auth real) ─────────────────────────── */
function LoginScreen({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  async function submit() {
    if (!usuario.trim() || !password || checking) return;
    setChecking(true);
    setError("");
    const res = await iniciarSesion(usuario, password);
    setChecking(false);
    if (res.error) setError(res.error);
    else onLogin(res.user);
  }

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${C.navyDark} 0%, ${C.navy} 60%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: FONT,
      position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, backgroundImage: `url(${SERVIPRAC_WATERMARK})`,
        backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "min(140vw, 900px)",
        opacity: 0.9, pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 74, height: 74, borderRadius: 18, background: "#fff", margin: "0 auto 14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)", padding: 8,
          }}>
            <img src={SERVIPRAC_LOGO} alt="Logo SERVIPRAC S.A." style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: 0.2 }}>SERVIPRAC S.A.</div>
          <div style={{ color: C.celeste, fontSize: 12.5, marginTop: 4, fontWeight: 600 }}>
            Sistema de Gestión de Personal Embarcado · REGINAVE
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.inkSoft, marginBottom: 12 }}>
            INICIAR SESIÓN
          </div>
          <div style={{ marginBottom: 12 }}>
            <Field label="Usuario" value={usuario} onChange={setUsuario} />
          </div>
          <div style={{ marginBottom: 6, position: "relative" }}>
            <Field label="Contraseña" type={showPw ? "text" : "password"} value={password}
              onChange={(v) => { setPassword(v); if (error) setError(""); }} />
            <button onClick={() => setShowPw(!showPw)} style={{
              position: "absolute", right: 10, top: 27, background: "transparent", border: "none", cursor: "pointer", color: C.inkSoft,
            }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <div style={{ color: C.red, fontSize: 12, fontWeight: 700, margin: "6px 0 4px" }}>{error}</div>}
          <div style={{ marginTop: 14 }}>
            <Btn tone="primary" icon={Lock} disabled={checking || !usuario || !password} onClick={submit} full>
              {checking ? "Verificando…" : "Ingresar"}
            </Btn>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 10, display: "flex", gap: 8 }}>
          <ShieldAlert size={14} color={C.celeste} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 10.5, color: C.celeste, lineHeight: 1.4 }}>
            Autenticación real con Supabase Auth. Las contraseñas nunca se guardan en el código ni en
            este navegador. Los usuarios se administran desde el panel de Supabase (Presidencia).
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

  const ready = r1 && r2 && r3 && r4 && r5 && r6 && r7;

  const TABS = useMemo(() => ([
    { id: "dashboard", label: "Dashboard", icon: TrendingUp },
    { id: "personal", label: "Personal", icon: Users },
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
  ]), [seesNomina]);

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
        {!ready ? (
          <div style={{ textAlign: "center", padding: 60, color: C.inkSoft }}>Cargando datos…</div>
        ) : (
          <>
            {tab === "dashboard" && (
              <Dashboard empleados={empleados} sanciones={sanciones} incidentes={incidentes}
                evaluaciones={evaluaciones} capacitaciones={capacitaciones} role={role} />
            )}
            {tab === "personal" && (
              <PersonalTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit} />
            )}
            {tab === "habilitaciones" && (
              <HabilitacionesTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit} />
            )}
            {tab === "medicos" && (
              <MedicosTab empleados={empleados} setEmpleados={setEmpleados} canEdit={canEdit} />
            )}
            {tab === "capacitacion" && (
              <CapacitacionTab empleados={empleados} items={capacitaciones} setItems={setCapacitaciones} canEdit={canEdit} />
            )}
            {tab === "dotacion" && <DotacionTab empleados={empleados} />}
            {tab === "embarcos" && (
              <EmbarcosTab empleados={empleados} items={embarcos} setItems={setEmbarcos} canEdit={canEdit} />
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
          </>
        )}
      </div>
    </div>
  );
}


const ROLE_META = {
  presidente: { label: "PRESIDENCIA", bg: C.gold, icon: Crown },
  rrhh: { label: "RRHH", bg: C.celeste, icon: Users },
  patron: { label: "PATRÓN", bg: "#5B6472", icon: Anchor },
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
function PersonalTab({ empleados, setEmpleados, canEdit }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = empleados.filter((e) =>
    `${e.apellido} ${e.nombre} ${e.dni}`.toLowerCase().includes(q.toLowerCase())
  );

  function save(form) {
    setEmpleados(empleados.map((e) => (e.id === form.id ? form : e)));
    setEditing(null);
  }

  return (
    <div>
      <SectionTitle icon={Users} title="Personal" subtitle={`${empleados.length} trabajadores registrados`} />
      <SearchBox q={q} setQ={setQ} placeholder="Buscar por apellido, nombre o DNI…" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((e) => (
          <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: C.celesteLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, color: C.navy, fontSize: 13 }}>
              {e.apellido[0]}{e.nombre[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{e.apellido}, {e.nombre}</div>
              <div style={{ fontSize: 11.5, color: C.inkSoft }}>
                DNI {e.dni} · {e.cargo || "Sin cargo asignado"} · Antig. {antiguedad(e.fIngreso)}a
              </div>
            </div>
            {canEdit && <IconBtn icon={Pencil} tone="primary" onClick={() => setEditing(e)} title="Editar" />}
          </div>
        ))}
        {filtered.length === 0 && <EmptyState icon={Users} text="Sin resultados." />}
      </div>

      {editing && (
        <Modal title={`${editing.apellido}, ${editing.nombre}`} onClose={() => setEditing(null)} wide>
          <PersonalForm emp={editing} onCancel={() => setEditing(null)} onSave={save} />
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

function PersonalForm({ emp, onCancel, onSave }) {
  const [f, setF] = useState(emp);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Field label="Apellido" value={f.apellido} onChange={set("apellido")} />
        <Field label="Nombre" value={f.nombre} onChange={set("nombre")} />
        <Field label="DNI" value={f.dni} onChange={set("dni")} />
        <Field label="CUIL" value={f.cuil} onChange={set("cuil")} />
        <Field label="Cargo" value={f.cargo} onChange={set("cargo")} options={CARGOS} />
        <Field label="Categoría REGINAVE" value={f.categoriaReginave} onChange={set("categoriaReginave")} options={CATEGORIAS} />
        <Field label="Lancha asignada" value={f.lancha} onChange={set("lancha")} options={["Cóndor I", "Cóndor II", "Reemplazo"]} />
        <Field label="Distrito PNA" value={f.distritoPNA} onChange={set("distritoPNA")} />
        <Field label="Estado" value={f.estado} onChange={set("estado")} options={["Activo", "Licencia", "Suspendido", "Baja"]} />
        <div />
        <Field label="Fecha Nacimiento" type="date" value={f.fNacimiento} onChange={set("fNacimiento")} />
        <Field label="Fecha Ingreso" type="date" value={f.fIngreso} onChange={set("fIngreso")} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn tone="ghost" onClick={onCancel} full>Cancelar</Btn>
        <Btn tone="primary" icon={Save} onClick={() => onSave(f)} full>Guardar</Btn>
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
                Libreta: {e.libretaEmbarco || "—"} · {e.categoriaReginave || "Sin categoría"}
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
        <Field label="Categoría REGINAVE" value={f.categoriaReginave} onChange={set("categoriaReginave")} options={CATEGORIAS} />
        <Field label="Distrito PNA" value={f.distritoPNA} onChange={set("distritoPNA")} />
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
function MedicosTab({ empleados, setEmpleados, canEdit }) {
  const [editing, setEditing] = useState(null);
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
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>Vence: {fmtDate(e.vencCertMedico)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pill bg={t.bg} fg={t.fg}>{t.label}</Pill>
                {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(e)} title="Editar" />}
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

/* ─────────────────────────── DOTACIÓN TAB (referencia estática) ─────────────────────────── */
function DotacionTab({ empleados }) {
  const condorI = empleados.filter((e) => e.lancha === "Cóndor I");
  const condorII = empleados.filter((e) => e.lancha === "Cóndor II");
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
      {[["Cóndor I", condorI], ["Cóndor II", condorII]].map(([label, list]) => (
        <div key={label} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.navy, marginBottom: 6 }}>{label} · {list.length} tripulantes</div>
          {list.length === 0 ? (
            <div style={{ fontSize: 11.5, color: C.inkSoft }}>Sin asignaciones cargadas.</div>
          ) : list.map((e) => (
            <div key={e.id} style={{ fontSize: 12, color: C.ink, padding: "4px 0" }}>
              {e.apellido}, {e.nombre} — {e.cargo || "sin cargo"}
            </div>
          ))}
        </div>
      ))}
      <div style={{ marginTop: 4, padding: 12, background: C.yellowLight, borderRadius: 10, fontSize: 11.5, color: "#6B5A0A" }}>
        La lancha no puede zarpar por debajo de la dotación mínima reglamentaria (Punto 22 del Reglamento). Verificar cargo y categoría antes del servicio.
      </div>
    </div>
  );
}

/* ─────────────────────────── EMBARCOS TAB ─────────────────────────── */
function EmbarcosTab({ empleados, items, setItems, canEdit }) {
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
          <EmbarcoForm empleados={empleados} onCancel={() => setAdding(false)} onSave={add} />
        </Modal>
      )}
    </div>
  );
}
function EmbarcoForm({ empleados, onCancel, onSave }) {
  const [f, setF] = useState({ empleadoId: "", lancha: "", fEmbarco: todayISO(), fDesembarco: "" });
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const valid = f.empleadoId && f.lancha;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <EmpPicker value={f.empleadoId} onChange={set("empleadoId")} empleados={empleados} />
        <Field label="Lancha" value={f.lancha} onChange={set("lancha")} options={["Cóndor I", "Cóndor II"]} span={2} />
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
        Esta información es sensible. No se muestra en el rol Patrón.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {empleados.map((e) => {
          const n = map[e.id];
          return (
            <div key={e.id} style={{ background: C.card, borderRadius: 12, padding: 13, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: C.navy }}>{e.apellido}, {e.nombre}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>
                  {n ? `${n.categoriaCCT || "—"} · Básico $${Number(n.salarioBasico || 0).toLocaleString("es-AR")}` : "Sin datos cargados"}
                </div>
              </div>
              {canEdit && <IconBtn icon={Pencil} onClick={() => setEditing(n || { empleadoId: e.id, categoriaCCT: "", salarioBasico: "" })} title="Editar" />}
            </div>
          );
        })}
      </div>
      {editing && (
        <Modal title={`Nómina — ${empName(empleados, editing.empleadoId)}`} onClose={() => setEditing(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <Field label="Categoría CCT" value={editing.categoriaCCT} onChange={(v) => setEditing({ ...editing, categoriaCCT: v })} />
            <Field label="Salario básico ($)" type="number" value={editing.salarioBasico} onChange={(v) => setEditing({ ...editing, salarioBasico: v })} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn tone="ghost" onClick={() => setEditing(null)} full>Cancelar</Btn>
            <Btn tone="primary" icon={Save} onClick={() => save(editing)} full>Guardar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}