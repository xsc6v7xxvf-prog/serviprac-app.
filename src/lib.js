import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient.js";

/* ─────────────────────────── DESIGN TOKENS ─────────────────────────── */
export const C = {
  navy: "#002868",
  navyDark: "#001238",
  celeste: "#75AADB",
  celesteLight: "#EBF5FF",
  gold: "#C8960C",
  goldLight: "#FBF0D9",
  green: "#1E8449",
  greenLight: "#E8F8EE",
  red: "#C0392B",
  redLight: "#FBEAE8",
  orange: "#E67E22",
  orangeLight: "#FDF0E3",
  yellow: "#B7950B",
  yellowLight: "#FEF9E3",
  bg: "#EEF2F8",
  card: "#FFFFFF",
  ink: "#1A2332",
  inkSoft: "#5B6472",
  border: "#DCE3EE",
};

export const FONT = "'Segoe UI', ui-sans-serif, system-ui, -apple-system, Roboto, sans-serif";

/* Logo e isotipo SERVIPRAC S.A. — ahora como archivos reales en /public,
   no como texto base64 embebido (mucho más seguro de pegar y de mantener) */
export const SERVIPRAC_LOGO = "/logo.png";
export const SERVIPRAC_WATERMARK = "/watermark.png";


export const REGLAMENTO_22 = [
  {
    n: 1,
    obligacion: "Mantener vigente la Libreta de Embarco y habilitación REGINAVE. Prohibido embarcar con documentación vencida.",
    norma: "REGINAVE Cap.I-II\nLey 20.094 Art.88",
    tipoFalta: "Incumplimiento documental",
    gravedad: "MUY GRAVE",
    sancion1: "Suspensión inmediata hasta regularizar",
    sancionR: "Baja del servicio + Informe PNA",
    pna: "SÍ",
  },
  {
    n: 2,
    obligacion: "Mantener vigente el Certificado Médico PNA (aptitud física). Prohibido prestar servicio sin aptitud vigente.",
    norma: "REGINAVE Cap.VI\nOrd.Mar. PNA",
    tipoFalta: "Incumplimiento documental",
    gravedad: "MUY GRAVE",
    sancion1: "Suspensión inmediata hasta renovar",
    sancionR: "Baja del servicio",
    pna: "SÍ",
  },
  {
    n: 3,
    obligacion: "Puntualidad y asistencia. Presentarse en el lugar, hora y condiciones indicadas para el turno asignado.",
    norma: "CCT Aplicable\nMLC 2006 Reg.2.3",
    tipoFalta: "Conducta laboral",
    gravedad: "LEVE→GRAVE",
    sancion1: "Apercibimiento verbal",
    sancionR: "Aperc. escrito; 3ra vez: Susp. 1-3 días",
    pna: "NO",
  },
  {
    n: 4,
    obligacion: "SOBRIEDAD ABSOLUTA. CERO TOLERANCIA al consumo de alcohol, drogas o psicoactivos antes/durante el servicio.",
    norma: "Ley 20.094 Art.111\nREGINAVE Cap.VII\nISO 45001",
    tipoFalta: "CERO TOLER.",
    gravedad: "CERO TOLER.",
    sancion1: "Suspensión inmediata + Denuncia PNA",
    sancionR: "BAJA INMEDIATA + Denuncia penal",
    pna: "SÍ",
  },
  {
    n: 5,
    obligacion: "Presentación personal reglamentaria: uniforme completo, limpio y en buen estado.",
    norma: "CCT Aplicable\nOrd.Interna",
    tipoFalta: "Conducta laboral",
    gravedad: "LEVE",
    sancion1: "Apercibimiento verbal",
    sancionR: "Apercibimiento escrito",
    pna: "NO",
  },
  {
    n: 6,
    obligacion: "Cumplir estrictamente el Reglamento Internacional de Abordaje (COLREGS) y señales náuticas PNA.",
    norma: "COLREGS 1972\nLey 20.094 Art.120\nREGINAVE Cap.II",
    tipoFalta: "Seguridad náutica",
    gravedad: "GRAVE",
    sancion1: "Aperc. escrito + Capacitación obligatoria",
    sancionR: "Suspensión 5-10 días + Informe PNA",
    pna: "SÍ",
  },
  {
    n: 7,
    obligacion: "Uso correcto del radio VHF según ORR/procedimientos PNA. Prohibido uso personal del radio de abordo.",
    norma: "UIT-R M.489\nENACOM / Ord.Mar. PNA",
    tipoFalta: "Procedimiento operativo",
    gravedad: "LEVE→GRAVE",
    sancion1: "Apercibimiento escrito",
    sancionR: "Susp. 1-3 días; 3ra vez: Susp.5 días",
    pna: "SÍ",
  },
  {
    n: 8,
    obligacion: "Conocer y cumplir el Rol de Seguridad, Plan de Emergencia y procedimientos a bordo.",
    norma: "SOLAS Cap.III Reg.19\nREGINAVE Cap.V\nISO 45001 §8.1",
    tipoFalta: "Seguridad a bordo",
    gravedad: "GRAVE",
    sancion1: "Aperc. escrito + Capacitación forzosa",
    sancionR: "Suspensión 3-5 días + Informe PNA",
    pna: "SÍ",
  },
  {
    n: 9,
    obligacion: "Participación obligatoria en todos los simulacros y drills programados por la empresa y/o PNA.",
    norma: "SOLAS III/19\nREGINAVE Cap.V\nDec.770/2019",
    tipoFalta: "Procedimiento operativo",
    gravedad: "GRAVE",
    sancion1: "Apercibimiento escrito",
    sancionR: "Suspensión 1-3 días + Descuento en evaluación",
    pna: "NO",
  },
  {
    n: 10,
    obligacion: "Uso obligatorio de EPP: chaleco, arnés, guantes, calzado de seguridad y demás según tarea.",
    norma: "ISO 45001:2018 §8.8\nLey 19.587 / Ord.Mar. PNA",
    tipoFalta: "Seguridad y salud",
    gravedad: "LEVE→GRAVE",
    sancion1: "Apercibimiento verbal",
    sancionR: "Aperc. escrito; 3ra vez: Susp. 1 día",
    pna: "NO",
  },
  {
    n: 11,
    obligacion: "Cuidado, limpieza y mantenimiento de la lancha y equipos. Daños por negligencia generan responsabilidad económica.",
    norma: "REGINAVE Cap.III\nLey 20.094 Art.152\nISO 9001 §8.5",
    tipoFalta: "Operativa y patrimonio",
    gravedad: "GRAVE",
    sancion1: "Aperc. escrito + Responsabilidad civil",
    sancionR: "Susp. 3-10 días + Resarcimiento",
    pna: "NO",
  },
  {
    n: 12,
    obligacion: "Completar correctamente la Bitácora/Diario de Máquinas en cada guardia. Prohibida la falsificación.",
    norma: "Ley 20.094 Art.152\nREGINAVE Cap.IV\nISO 9001 §7.5",
    tipoFalta: "Documentación operativa",
    gravedad: "GRAVE",
    sancion1: "Aperc. escrito. Falsificación: BAJA",
    sancionR: "BAJA + Denuncia penal si hay fraude",
    pna: "SÍ (fraude)",
  },
  {
    n: 13,
    obligacion: "Cumplir la normativa MARPOL. Prohibido arrojar basura, aceites o residuos al agua (Ley 22.190).",
    norma: "MARPOL Ane.I-V\nLey 22.190 (ARG)\nOrd.Mar. PNA",
    tipoFalta: "Ambiental (MARPOL)",
    gravedad: "MUY GRAVE",
    sancion1: "Aperc. escrito + Denuncia PNA (Ley 22.190)",
    sancionR: "Susp. 10-30 días + Posible baja",
    pna: "SÍ",
  },
  {
    n: 14,
    obligacion: "Respeto irrestricto a superiores, pares, Prácticos embarcados e inspectores PNA.",
    norma: "MLC 2006 Reg.1.4\nCCT Aplicable\nREGINAVE Cap.VII",
    tipoFalta: "Disciplina laboral",
    gravedad: "LEVE→GRAVE",
    sancion1: "Apercibimiento escrito",
    sancionR: "Susp. 3-10 días. Falta grave: BAJA",
    pna: "NO",
  },
  {
    n: 15,
    obligacion: "Acatamiento de órdenes legítimas del Patrón/superiores. Desobediencia en maniobra/emergencia: falta muy grave.",
    norma: "Ley 20.094 Art.111\nREGINAVE Cap.II / CCT",
    tipoFalta: "Disciplina operativa",
    gravedad: "GRAVE→MUY GRAVE",
    sancion1: "Aperc. escrito (fuera maniobra). Maniobra: Susp.5 días",
    sancionR: "Susp.10-30 días o BAJA",
    pna: "SÍ (si riesgo)",
  },
  {
    n: 16,
    obligacion: "Conducta apropiada ante inspecciones PNA. Prohibido obstaculizar la tarea inspectiva.",
    norma: "Ley 20.094 Arts.5-7\nREGINAVE Cap.I\nDec.770/2019",
    tipoFalta: "Disciplina institucional",
    gravedad: "MUY GRAVE",
    sancion1: "Suspensión inmediata 3-10 días + Informe PNA",
    sancionR: "BAJA + Denuncia a PNA",
    pna: "SÍ",
  },
  {
    n: 17,
    obligacion: "Confidencialidad absoluta sobre información comercial, datos de Prácticos y operaciones de practicaje.",
    norma: "Ley 24.766 (Conf.)\nCCT / Dec.770/2019",
    tipoFalta: "Disciplina informática",
    gravedad: "GRAVE",
    sancion1: "Aperc. escrito + Advertencia legal",
    sancionR: "Suspensión + Acción legal + posible BAJA",
    pna: "SÍ (si afecta PNA)",
  },
  {
    n: 18,
    obligacion: "Prohibido el uso de teléfonos celulares durante maniobras, guardia activa o emergencias.",
    norma: "REGINAVE Cap.II\nISO 45001 §8.1\nOrd.Mar. PNA",
    tipoFalta: "Seguridad operativa",
    gravedad: "LEVE→GRAVE",
    sancion1: "Apercibimiento verbal",
    sancionR: "Aperc. escrito; 3ra vez: Susp. 1-3 días",
    pna: "NO",
  },
  {
    n: 19,
    obligacion: "CERO TOLERANCIA a actos de violencia física o verbal, amenazas o acoso a cualquier persona a bordo.",
    norma: "MLC 2006 Reg.1.4\nLey 26.485 / Cód.Penal / CCT",
    tipoFalta: "CERO TOLER.",
    gravedad: "CERO TOLER.",
    sancion1: "Suspensión inmediata + Proceso disciplinario + Denuncia penal",
    sancionR: "BAJA INMEDIATA + Denuncia + Informe PNA",
    pna: "SÍ",
  },
  {
    n: 20,
    obligacion: "CERO TOLERANCIA al hurto, robo, apropiación indebida o cualquier acto deshonesto sobre bienes de la empresa, de los Prácticos o de terceros.",
    norma: "Cód. Penal Arts.162-165\nLey 20.094 / CCT",
    tipoFalta: "CERO TOLER.",
    gravedad: "CERO TOLER.",
    sancion1: "BAJA INMEDIATA + Denuncia penal + Informe PNA",
    sancionR: "— (BAJA en 1ra vez)",
    pna: "SÍ",
  },
  {
    n: 21,
    obligacion: "LLEGADA TARDÍA AL SERVICIO DE PRACTICAJE.\nTodo tripulante debe estar a bordo y operativo ANTES de la hora asignada por Despacho.\nLa demora impacta directamente sobre el buque cliente, el Práctico y la habilitación PNA de la empresa.\nEscala según minutos de demora:\n  • < 15 min: Aperc. escrito + Aviso previo obligatorio al Despacho\n  • 15–30 min: Aperc. escrito + Evaluación de responsabilidad económica\n  • > 30 min: Suspensión 1-3 días + Resarcimiento si hubiere\n  • Sin aviso: Agrava un nivel la sanción en todos los casos.",
    norma: "Dec. 770/2019 Arts. 8 y 18\nREGINAVE Cap.II\nLey 24.093 (Puertos)\nCCT Aplicable",
    tipoFalta: "Operativa crítica\n(Practicaje)",
    gravedad: "GRAVE",
    sancion1: "< 15 min CON AVISO: Aperc. escrito\n< 15 min SIN AVISO: Susp. 1 día\n15–30 min: Susp. 1-3 días + resp. econ.\n> 30 min: Susp. 3-5 días + resp. econ.",
    sancionR: "3ra demora en 6 meses: Susp. 5-10 días\nReincidencia habitual: BAJA con causa\n+ Comunicación a PNA si hay antecedente\ndisciplinario previo",
    pna: "SÍ (si buque\nafectado)",
  },
  {
    n: 22,
    obligacion: "ZARPE SIN DOTACIÓN MÍNIMA SEGURA (PNA).\nEl Patrón tiene DEBER LEGAL de negarse a zarpar si la dotación no cumple el mínimo establecido en el\nCertificado de Seguridad de Dotación emitido por PNA para la embarcación.\nNinguna orden, presión comercial o del cliente justifica esta infracción.\nIMPORTANTE: La empresa también es responsable si no garantiza la dotación a tiempo.\nConsecuencias adicionales: nulidad del seguro, detención del buque por PNA, responsabilidad penal\ndel Patrón y del Armador en caso de accidente.",
    norma: "REGINAVE Cap.III (Dotación)\nDec. 770/2019 Arts. 10-12\nLey 20.094 Arts. 111-120\nOrd.Mar. PNA – Cert.Seg.Dotación\nISO 45001:2018 §8.1 / SOLAS",
    tipoFalta: "Seguridad náutica\nMUY GRAVE\n(CERO TOLER.)",
    gravedad: "CERO TOLER.",
    sancion1: "Suspensión INMEDIATA del Patrón\npendiente investigación\n+ Informe OBLIGATORIO a PNA\n+ Acta de infracción Armador/PNA\n+ Investigación interna",
    sancionR: "BAJA CON CAUSA del Patrón\n+ Denuncia penal (si hubo accidente)\n+ Revisión habilitación REGINAVE\npor PNA\n+ Suspensión operativa lancha",
    pna: "SÍ\n(OBLIGATORIO\nINMEDIATO)",
  },
];

export const CRITERIOS = [
  {
    key: "c1",
    area: "MANEJO NÁUTICO (REGINAVE)",
    criterio: "Habilidad de maniobra con la lancha en puerto/canal",
    pond: 0.08,
    norma: "REGINAVE Cap.II",
  },
  {
    key: "c2",
    area: "MANEJO NÁUTICO (REGINAVE)",
    criterio: "Conocimiento del reglamento de abordaje (COLREGS)",
    pond: 0.06,
    norma: "COLREGS / Ley 20.094",
  },
  {
    key: "c3",
    area: "MANEJO NÁUTICO (REGINAVE)",
    criterio: "Correcta utilización de radio (ORR / GMDSS restringido)",
    pond: 0.04,
    norma: "ENACOM / UIT-R",
  },
  {
    key: "c4",
    area: "MANEJO NÁUTICO (REGINAVE)",
    criterio: "Conocimiento de señales náuticas y balizamiento PNA",
    pond: 0.04,
    norma: "Ord.Mar. PNA",
  },
  {
    key: "c5",
    area: "SEGURIDAD Y GUARDIA (PNA/SOLAS)",
    criterio: "Cumplimiento de procedimientos de seguridad PNA",
    pond: 0.09,
    norma: "ISO 45001 / PNA",
  },
  {
    key: "c6",
    area: "SEGURIDAD Y GUARDIA (PNA/SOLAS)",
    criterio: "Uso correcto de EPP y chalecos salvavidas",
    pond: 0.06,
    norma: "ISO 45001 §8.8",
  },
  {
    key: "c7",
    area: "SEGURIDAD Y GUARDIA (PNA/SOLAS)",
    criterio: "Participación en simulacros y drills de emergencia",
    pond: 0.05,
    norma: "SOLAS / REGINAVE",
  },
  {
    key: "c8",
    area: "SEGURIDAD Y GUARDIA (PNA/SOLAS)",
    criterio: "Reporte de situaciones de riesgo a la PNA",
    pond: 0.04,
    norma: "ISO 45001 §10.2",
  },
  {
    key: "c9",
    area: "EMBARCACIÓN Y EQUIPOS (REGINAVE)",
    criterio: "Cuidado y mantenimiento de la lancha y equipos",
    pond: 0.07,
    norma: "REGINAVE Cap.III",
  },
  {
    key: "c10",
    area: "EMBARCACIÓN Y EQUIPOS (REGINAVE)",
    criterio: "Registro y control del diario de máquinas/bitácora",
    pond: 0.05,
    norma: "Ley 20.094 Art.152",
  },
  {
    key: "c11",
    area: "EMBARCACIÓN Y EQUIPOS (REGINAVE)",
    criterio: "Control del combustible y lubricantes",
    pond: 0.04,
    norma: "MARPOL / Ley 22.190",
  },
  {
    key: "c12",
    area: "CONDUCTA Y DISCIPLINA (MLC 2006/ CCT)",
    criterio: "Puntualidad y presentación reglamentaria",
    pond: 0.06,
    norma: "CCT / MLC 2006",
  },
  {
    key: "c13",
    area: "CONDUCTA Y DISCIPLINA (MLC 2006/ CCT)",
    criterio: "Respeto a superiores, pares y al Práctico embarcado",
    pond: 0.06,
    norma: "MLC 2006 Reg. 1.4",
  },
  {
    key: "c14",
    area: "CONDUCTA Y DISCIPLINA (MLC 2006/ CCT)",
    criterio: "Cumplimiento del reglamento interno y CCT",
    pond: 0.05,
    norma: "CCT / ISM Code",
  },
  {
    key: "c15",
    area: "CONDUCTA Y DISCIPLINA (MLC 2006/ CCT)",
    criterio: "Conducta ante organismos PNA en inspecciones",
    pond: 0.04,
    norma: "REGINAVE / PNA",
  },
  {
    key: "c16",
    area: "LIDERAZGO Y TRABAJO EN EQUIPO",
    criterio: "Comunicación efectiva con el Práctico y buque",
    pond: 0.06,
    norma: "Dec. 770/2019",
  },
  {
    key: "c17",
    area: "LIDERAZGO Y TRABAJO EN EQUIPO",
    criterio: "Coordinación en maniobras de embarco/desembarco",
    pond: 0.05,
    norma: "Dec. 770/2019 Art.8",
  },
  {
    key: "c18",
    area: "LIDERAZGO Y TRABAJO EN EQUIPO",
    criterio: "Liderazgo en situaciones de emergencia",
    pond: 0.05,
    norma: "REGINAVE Cap.II",
  },
  {
    key: "c19",
    area: "FORMACIÓN (REGINAVE/ PNA)",
    criterio: "Cursos REGINAVE vigentes y al día",
    pond: 0.04,
    norma: "REGINAVE / PNA",
  },
  {
    key: "c20",
    area: "FORMACIÓN (REGINAVE/ PNA)",
    criterio: "Iniciativa en capacitación adicional PNA",
    pond: 0.04,
    norma: "ISO 9001 §7.2",
  },
];

export const TOTAL_POND = 1.07;

export const VEREDICTOS_TABLA = [
  {
    rango: "4.50–5.00",
    categoria: "EXCELENTE",
    veredicto: "ASCENSO RECOMENDADO",
    accion: "Proponer ascenso de categoría REGINAVE. Nota positiva en Libreta de Embarco.",
    ref: "REGINAVE Cap.V",
  },
  {
    rango: "4.00–4.49",
    categoria: "MUY BUENO",
    veredicto: "DESEMPEÑO DESTACADO",
    accion: "Candidato para plan de sucesión y reemplazo. Carta de reconocimiento.",
    ref: "REGINAVE Cap.V",
  },
  {
    rango: "3.00–3.99",
    categoria: "BUENO",
    veredicto: "CONTINÚA EN FUNCIÓN",
    accion: "Seguimiento semestral estándar. Sin novedad.",
    ref: "CCT Aplicable",
  },
  {
    rango: "2.00–2.99",
    categoria: "REGULAR",
    veredicto: "PLAN DE MEJORA",
    accion: "Notificación RRHH + Plan de mejora 90 días + tutoría.",
    ref: "MLC 2006 / CCT",
  },
  {
    rango: "1.50–1.99",
    categoria: "DEFICIENTE",
    veredicto: "OBSERVACIÓN FORMAL",
    accion: "Carta de observación formal · Comunicar a PNA si corresponde.",
    ref: "Ley 20.094",
  },
  {
    rango: "1.00–1.49",
    categoria: "CRÍTICO",
    veredicto: "PROCESO DISCIPLINARIO",
    accion: "Comité disciplinario · Posible baja · Informar PNA si hay inhabilitación.",
    ref: "REGINAVE Cap.VII",
  },
];

export const NOTA_LEGAL_EVAL = "⚖️  NOTA LEGAL: Documento controlado conforme Ley 20.094 (Navegación) · MLC 2006 (Ley 26.233) · CCT Aplicable. El evaluado tiene derecho a conocer su resultado y presentar descargo dentro de los 5 días hábiles. Los resultados 'Observación Formal' o 'Proceso Disciplinario' deben notificarse a la Prefectura Naval Argentina si implican inhabilitación. Este formulario integra la Libreta de Embarco del tripulante según REGINAVE.";
/* ─────────────────────────── DATOS DE REFERENCIA (est\u00e1ticos) ─────────────────────────── */
export const DOTACION_REF = [
  ["Lancha a motor pequeña","< 12m / < 10 TRB","1 Patrón de Puerto","No requerido","No requerido"],
  ["Lancha a motor mediana","12–20m / 10–50 TRB","1 Patrón de Puerto/Fluvial 2da","1 Motorista Naval MN-2","1 Marinero (opcional)"],
  ["Lancha a motor grande","20–30m / 50–100 TRB","1 Patrón Fluvial 1ra/Cap.Cabotaje","1 Maquinista Naval MN-1","1 Marinero Mercante"],
  ["Lancha practicaje (CÓNDOR I/II)","~18m / ~30 TRB","1 Patrón de Puerto/Fluvial 2da","1 Motorista/Maquinista","1 Marinero Mercante"],
];

export const ESTADOS_CIVILES = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Unión de hecho"];
export const GENEROS = ["Femenino", "Masculino", "Otro"];
export const TIPOS_CONTRATO = ["Indefinido", "Temporal", "Por obra", "Otro"];
export const LEGAJO_VACIO = {
  genero: "", nacionalidad: "Argentina", lugarNacimiento: "", estadoCivil: "",
  domicilioCalle: "", domicilioPiso: "", codigoPostal: "", ciudad: "", provincia: "", pais: "Argentina",
  telefonoCelular: "", telefonoFijo: "", email: "", codigoEmpleado: "", area: "", tipoContrato: "",
  emergenciaNombre: "", emergenciaParentesco: "", emergenciaTelefono: "", declaracionFecha: "", declaracionCiudad: "",
};
export const BENEF_VACIO = () => ({ nombre: "", dni: "", parentesco: "", fechaNacimiento: "", telefono: "", porcentaje: "" });
export const sumaPorcentajes = (bs) => bs.reduce((a, b) => a + (parseFloat(b.porcentaje) || 0), 0);
export const cbuValido = (v) => !v || /^\d{22}$/.test(String(v).replace(/\s/g, ""));
export const maskCBU = (v) => (v ? `••••${String(v).slice(-4)}` : "");
/** Avance del legajo: 6 controles que RRHH puede completar. */
export function estadoLegajo(leg, bens) {
  const l = leg || {};
  const cargados = (bens || []).filter((b) => b.nombre && b.nombre.trim());
  const checks = [
    ["Domicilio", !!(l.domicilioCalle && l.ciudad)],
    ["Teléfono celular", !!l.telefonoCelular],
    ["Estado civil", !!l.estadoCivil],
    ["Contacto de emergencia", !!(l.emergenciaNombre && l.emergenciaTelefono)],
    ["Beneficiarios (100%)", cargados.length > 0 && Math.abs(sumaPorcentajes(cargados) - 100) < 0.001],
    ["Declaración jurada", !!l.declaracionFecha],
  ];
  return { hechos: checks.filter((c) => c[1]).length, total: checks.length, faltan: checks.filter((c) => !c[1]).map((c) => c[0]) };
}
export const CARGOS = ["Patrón Motorista Profesional de Primera", "Patrón Motorista Profesional de Segunda", "Patrón Motorista Profesional de Tercera", "Marinero con Máximo de Cargo", "Marinero de Puente", "Marinero Especial", "Marinero", "Auxiliar de Máquinas Navales", "Maestranza-Camarero", "Práctico", "Administrativo"];
export const CURSOS_REGINAVE = ["Formación Básica de Seguridad (FBS)", "Lucha Contra Incendio", "Técnicas de Supervivencia",
  "Operador Radio Restringido (ORR)", "Primeros Auxilios a Bordo", "Manejo Seguro de Lanchas de Practicaje", "Prevención de Contaminación (MARPOL)"];
export const TIPOS_SANCION = ["Apercibimiento Verbal", "Apercibimiento Escrito", "Suspensión 1-3 días", "Suspensión 4-10 días", "Suspensión 11-30 días", "Baja con causa"];
export const ROL_OPCIONES = [
  { value: "presidente", label: "Presidente / Directorio" },
  { value: "rrhh", label: "Recursos Humanos" },
  { value: "director", label: "Director" },
  { value: "vicepresidente", label: "Vicepresidente" },
];
export function rolLabel(v) { return ROL_OPCIONES.find((r) => r.value === v)?.label || v; }

/* ─────────────────────────── UTILIDADES ─────────────────────────── */
export const uid = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export const todayISO = () => new Date().toISOString().slice(0, 10);

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d)) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d - now) / 86400000);
}

export function expiryTone(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return { label: "Sin dato", bg: C.border, fg: C.inkSoft };
  if (days < 0) return { label: `Vencido hace ${Math.abs(days)}d`, bg: C.redLight, fg: C.red };
  if (days <= 30) return { label: `Vence en ${days}d`, bg: C.redLight, fg: C.red };
  if (days <= 90) return { label: `Vence en ${days}d`, bg: C.orangeLight, fg: C.orange };
  if (days <= 180) return { label: `Vence en ${days}d`, bg: C.yellowLight, fg: C.yellow };
  return { label: "Vigente", bg: C.greenLight, fg: C.green };
}

export function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return d.length === 10 ? `${day}/${m}/${y}` : d;
}

export function age(dateStr) {
  if (!dateStr) return "—";
  const b = new Date(dateStr + "T00:00:00");
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
  return a;
}

export function antiguedad(dateStr) {
  if (!dateStr) return 0;
  const b = new Date(dateStr + "T00:00:00");
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
  return Math.max(a, 0);
}

export function veredicto(score) {
  const s = Number(score);
  let row;
  if (s >= 4.5) row = VEREDICTOS_TABLA[0];
  else if (s >= 4) row = VEREDICTOS_TABLA[1];
  else if (s >= 3) row = VEREDICTOS_TABLA[2];
  else if (s >= 2) row = VEREDICTOS_TABLA[3];
  else if (s >= 1.5) row = VEREDICTOS_TABLA[4];
  else row = VEREDICTOS_TABLA[5];
  const VEREDICTO_COLORS = {
    "ASCENSO RECOMENDADO": { bg: C.greenLight, fg: C.green },
    "DESEMPEÑO DESTACADO": { bg: C.greenLight, fg: C.green },
    "CONTINÚA EN FUNCIÓN": { bg: C.celesteLight, fg: C.navy },
    "PLAN DE MEJORA": { bg: C.yellowLight, fg: C.yellow },
    "OBSERVACIÓN FORMAL": { bg: C.orangeLight, fg: C.orange },
    "PROCESO DISCIPLINARIO": { bg: C.redLight, fg: C.red },
  };
  const colors = VEREDICTO_COLORS[row.veredicto] || { bg: C.border, fg: C.inkSoft };
  return { ...row, text: row.veredicto, ...colors };
}

export function groupByArea(list) {
  const out = [];
  for (const c of list) {
    let g = out.find((x) => x.area === c.area);
    if (!g) { g = { area: c.area, items: [] }; out.push(g); }
    g.items.push(c);
  }
  return out;
}

/* ─────────────────────────── AUTENTICACIÓN REAL (Supabase Auth) ─────────────────────────── */
export function usuarioToEmail(usuario) {
  return `${usuario.trim().toLowerCase()}@serviprac.internal`;
}

export async function iniciarSesion(usuario, password) {
  const email = usuarioToEmail(usuario);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Usuario o contraseña incorrectos." };
  const { data: perfil, error: perfilError } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", data.user.id)
    .single();
  if (perfilError || !perfil || perfil.activo === false) {
    await supabase.auth.signOut();
    return { error: "Tu cuenta no tiene un perfil activo asignado. Contactá a Presidencia." };
  }
  return { user: { id: perfil.id, nombre: perfil.nombre, rol: perfil.rol } };
}

export async function cerrarSesion() {
  await supabase.auth.signOut();
}

export async function restaurarSesion() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", data.session.user.id)
    .single();
  if (!perfil || perfil.activo === false) return null;
  return { id: perfil.id, nombre: perfil.nombre, rol: perfil.rol };
}

/* ─────────────────────────── MAPEADORES camelCase <-> snake_case ─────────────────────────── */
const mapEmpleado = {
  fromDb: (r) => ({
    id: r.id, apellido: r.apellido, nombre: r.nombre, dni: r.dni || "", cuil: r.cuil || "",
    fNacimiento: r.f_nacimiento || "", fIngreso: r.f_ingreso || "", cargo: r.cargo || "",
    libretaEmbarco: r.libreta_embarco || "",
    vencLibreta: r.venc_libreta || "", vencHabilitacion: r.venc_habilitacion || "",
    vencCertMedico: r.venc_cert_medico || "", lancha: r.lancha || "",
    estado: r.estado || "Activo",
  }),
  toDb: (e) => ({
    apellido: e.apellido, nombre: e.nombre, dni: e.dni || null, cuil: e.cuil || null,
    f_nacimiento: e.fNacimiento || null, f_ingreso: e.fIngreso || null, cargo: e.cargo || null,
    libreta_embarco: e.libretaEmbarco || null,
    venc_libreta: e.vencLibreta || null, venc_habilitacion: e.vencHabilitacion || null,
    venc_cert_medico: e.vencCertMedico || null, lancha: e.lancha || null,
    estado: e.estado || "Activo",
  }),
};
const mapCapacitacion = {
  fromDb: (r) => ({ id: r.id, empleadoId: r.empleado_id, curso: r.curso, fRealizacion: r.f_realizacion || "", fVencimiento: r.f_vencimiento || "" }),
  toDb: (e) => ({ empleado_id: e.empleadoId, curso: e.curso, f_realizacion: e.fRealizacion || null, f_vencimiento: e.fVencimiento || null }),
};
const mapEmbarco = {
  fromDb: (r) => ({ id: r.id, empleadoId: r.empleado_id, lancha: r.lancha, fEmbarco: r.f_embarco || "", fDesembarco: r.f_desembarco || "" }),
  toDb: (e) => ({ empleado_id: e.empleadoId, lancha: e.lancha, f_embarco: e.fEmbarco || null, f_desembarco: e.fDesembarco || null }),
};
const mapSancion = {
  fromDb: (r) => ({ id: r.id, empleadoId: r.empleado_id, puntoReglamento: r.punto_reglamento, descripcion: r.descripcion || "", tipoSancion: r.tipo_sancion, fecha: r.fecha, estado: r.estado }),
  toDb: (e) => ({ empleado_id: e.empleadoId, punto_reglamento: e.puntoReglamento || null, descripcion: e.descripcion || null, tipo_sancion: e.tipoSancion, fecha: e.fecha, estado: e.estado || "Abierto" }),
};
const mapIncidente = {
  fromDb: (r) => ({ id: r.id, tipo: r.tipo, empleadoId: r.empleado_id, fecha: r.fecha, minutos: r.minutos, avisoPrevio: r.aviso_previo || "", cargoFaltante: r.cargo_faltante || "", detalle: r.detalle || "" }),
  toDb: (e) => ({ tipo: e.tipo, empleado_id: e.empleadoId, fecha: e.fecha, minutos: e.minutos || null, aviso_previo: e.avisoPrevio || null, cargo_faltante: e.cargoFaltante || null, detalle: e.detalle || null }),
};
const mapEvaluacion = {
  fromDb: (r) => ({ id: r.id, empleadoId: r.empleado_id, evaluador: r.evaluador || "", fecha: r.fecha, puntaje: r.puntaje, veredicto: r.veredicto, scores: r.scores || {} }),
  toDb: (e) => ({ empleado_id: e.empleadoId, evaluador: e.evaluador || null, fecha: e.fecha, puntaje: e.puntaje, veredicto: e.veredicto, scores: e.scores || {} }),
};
const mapNomina = {
  fromDb: (r) => ({ id: r.id, empleadoId: r.empleado_id, categoriaCCT: r.categoria_cct || "", salarioBasico: r.salario_basico || "", cbu: r.cbu || "" }),
  toDb: (e) => ({ empleado_id: e.empleadoId, categoria_cct: e.categoriaCCT || null, salario_basico: e.salarioBasico || null, cbu: e.cbu || null }),
};
const mapEmbarcacion = {
  fromDb: (r) => ({
    id: r.id, nombre: r.nombre, matricula: r.matricula || "",
    materialCasco: r.material_casco || "", tipo: r.tipo || "",
    explotacionEspecifica: r.explotacion_especifica || "",
    eslora: r.eslora ?? "", manga: r.manga ?? "", puntal: r.puntal ?? "",
    tonelajeTotal: r.tonelaje_total ?? "", tonelajeNeto: r.tonelaje_neto ?? "",
    motores: r.motores || "", fechaInscripcion: r.fecha_inscripcion || "",
    estado: r.estado || "Activa",
  }),
  toDb: (e) => ({
    nombre: e.nombre, matricula: e.matricula || null,
    material_casco: e.materialCasco || null, tipo: e.tipo || null,
    explotacion_especifica: e.explotacionEspecifica || null,
    eslora: e.eslora || null, manga: e.manga || null, puntal: e.puntal || null,
    tonelaje_total: e.tonelajeTotal || null, tonelaje_neto: e.tonelajeNeto || null,
    motores: e.motores || null, fecha_inscripcion: e.fechaInscripcion || null,
    estado: e.estado || "Activa",
  }),
};

const mapAuditoria = {
  fromDb: (r) => ({
    id: r.id, tabla: r.tabla, registroId: r.registro_id, accion: r.accion,
    usuarioNombre: r.usuario_nombre || "Sistema",
    datosAnteriores: r.datos_anteriores, datosNuevos: r.datos_nuevos,
    creadoEn: r.creado_en,
  }),
  toDb: () => ({}), // solo lectura — nunca se escribe desde la app
};
const mapExamenSRT = {
  fromDb: (r) => ({
    id: r.id, empleadoId: r.empleado_id, tipo: r.tipo, fecha: r.fecha,
    resultado: r.resultado || "", proximoVencimiento: r.proximo_vencimiento || "",
    archivoPath: r.archivo_path || "", archivoNombre: r.archivo_nombre || "",
    notas: r.notas || "",
  }),
  toDb: (e) => ({
    empleado_id: e.empleadoId, tipo: e.tipo, fecha: e.fecha,
    resultado: e.resultado || null, proximo_vencimiento: e.proximoVencimiento || null,
    archivo_path: e.archivoPath || null, archivo_nombre: e.archivoNombre || null,
    notas: e.notas || null,
  }),
};

const mapLegajo = {
  fromDb: (r) => ({
    id: r.id, empleadoId: r.empleado_id, genero: r.genero || "", nacionalidad: r.nacionalidad || "",
    lugarNacimiento: r.lugar_nacimiento || "", estadoCivil: r.estado_civil || "",
    domicilioCalle: r.domicilio_calle || "", domicilioPiso: r.domicilio_piso || "", codigoPostal: r.codigo_postal || "",
    ciudad: r.ciudad || "", provincia: r.provincia || "", pais: r.pais || "",
    telefonoCelular: r.telefono_celular || "", telefonoFijo: r.telefono_fijo || "", email: r.email || "",
    codigoEmpleado: r.codigo_empleado || "", area: r.area || "", tipoContrato: r.tipo_contrato || "",
    emergenciaNombre: r.emergencia_nombre || "", emergenciaParentesco: r.emergencia_parentesco || "",
    emergenciaTelefono: r.emergencia_telefono || "",
    declaracionFecha: r.declaracion_fecha || "", declaracionCiudad: r.declaracion_ciudad || "",
  }),
  toDb: (e) => ({
    empleado_id: e.empleadoId, genero: e.genero || null, nacionalidad: e.nacionalidad || null,
    lugar_nacimiento: e.lugarNacimiento || null, estado_civil: e.estadoCivil || null,
    domicilio_calle: e.domicilioCalle || null, domicilio_piso: e.domicilioPiso || null, codigo_postal: e.codigoPostal || null,
    ciudad: e.ciudad || null, provincia: e.provincia || null, pais: e.pais || null,
    telefono_celular: e.telefonoCelular || null, telefono_fijo: e.telefonoFijo || null, email: e.email || null,
    codigo_empleado: e.codigoEmpleado || null, area: e.area || null, tipo_contrato: e.tipoContrato || null,
    emergencia_nombre: e.emergenciaNombre || null, emergencia_parentesco: e.emergenciaParentesco || null,
    emergencia_telefono: e.emergenciaTelefono || null,
    declaracion_fecha: e.declaracionFecha || null, declaracion_ciudad: e.declaracionCiudad || null,
  }),
};
const mapBeneficiario = {
  fromDb: (r) => ({
    id: r.id, empleadoId: r.empleado_id, orden: r.orden, nombre: r.nombre || "", dni: r.dni || "",
    parentesco: r.parentesco || "", fechaNacimiento: r.fecha_nacimiento || "", telefono: r.telefono || "",
    porcentaje: r.porcentaje === null || r.porcentaje === undefined ? "" : String(Number(r.porcentaje)),
  }),
  toDb: (e) => ({
    empleado_id: e.empleadoId, orden: e.orden, nombre: e.nombre, dni: e.dni || null,
    parentesco: e.parentesco || null, fecha_nacimiento: e.fechaNacimiento || null, telefono: e.telefono || null,
    porcentaje: e.porcentaje === "" || e.porcentaje === undefined ? null : Number(e.porcentaje),
  }),
};

export const TABLE_MAPS = {
  empleados: mapEmpleado,
  capacitaciones: mapCapacitacion,
  embarcos: mapEmbarco,
  sanciones: mapSancion,
  incidentes: mapIncidente,
  evaluaciones: mapEvaluacion,
  nomina_salarial: mapNomina,
  embarcaciones: mapEmbarcacion,
  auditoria: mapAuditoria,
  examenes_srt: mapExamenSRT,
  legajos: mapLegajo,
  beneficiarios: mapBeneficiario,
};

export const TIPOS_EXAMEN_SRT = ["Preocupacional", "Periódico", "Egreso"];
export const RESULTADOS_EXAMEN_SRT = ["Apto", "Apto con Observaciones", "No Apto"];

/* ─────────────────────────── ARCHIVOS: subida y descarga (Supabase Storage) ─────────────────────────── */
export async function subirArchivoExamen(empleadoId, file) {
  const ext = file.name.split(".").pop();
  const path = `${empleadoId}/${uid("exm")}.${ext}`;
  const { error } = await supabase.storage.from("examenes-srt").upload(path, file);
  if (error) return { error: error.message };
  return { path, nombre: file.name };
}

export async function descargarArchivoExamen(path) {
  const { data, error } = await supabase.storage.from("examenes-srt").createSignedUrl(path, 60);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}

export async function borrarArchivoExamen(path) {
  if (!path) return {};
  const { error } = await supabase.storage.from("examenes-srt").remove([path]);
  if (error) return { error: error.message };
  return {};
}

/* ─────────────────────────── HOOK: tabla conectada a Supabase ─────────────────────────── */
export function reportarError(tabla, accion, error) {
  console.error(accion, tabla, error);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("serviprac-error", { detail: { tabla, accion, mensaje: (error && error.message) || String(error) } }));
  }
}

export function useSupabaseTable(tableName) {
  const { fromDb, toDb } = TABLE_MAPS[tableName];
  const [data, setDataState] = useState([]);
  const [ready, setReady] = useState(false);
  const prevRef = useRef([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: rows, error } = await supabase.from(tableName).select("*").order("creado_en", { ascending: false });
      if (!alive) return;
      if (error) { console.error(tableName, error); setReady(true); return; }
      const mapped = (rows || []).map(fromDb);
      setDataState(mapped);
      prevRef.current = mapped;
      setReady(true);
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const setData = useCallback(async (next) => {
    const prev = prevRef.current;
    const prevIds = new Set(prev.map((x) => x.id));
    const nextIds = new Set(next.map((x) => x.id));

    const toDelete = prev.filter((x) => !nextIds.has(x.id));
    const toInsert = next.filter((x) => !prevIds.has(x.id));
    const toUpdate = next.filter((x) => {
      if (!prevIds.has(x.id)) return false;
      const before = prev.find((p) => p.id === x.id);
      return JSON.stringify(before) !== JSON.stringify(x);
    });

    setDataState(next);
    prevRef.current = next;

    for (const item of toDelete) {
      const { error } = await supabase.from(tableName).delete().eq("id", item.id);
      if (error) reportarError(tableName, "borrar", error);
    }
    for (const item of toUpdate) {
      const { error } = await supabase.from(tableName).update(toDb(item)).eq("id", item.id);
      if (error) reportarError(tableName, "actualizar", error);
    }
    const insertados = [];
    for (const item of toInsert) {
      const { data: inserted, error } = await supabase.from(tableName).insert(toDb(item)).select().single();
      if (error) { reportarError(tableName, "guardar", error); continue; }
      const real = fromDb(inserted);
      insertados.push(real);
      setDataState((curr) => curr.map((c) => (c.id === item.id ? real : c)));
      prevRef.current = prevRef.current.map((c) => (c.id === item.id ? real : c));
    }
    return insertados;
  }, [tableName]);

  return [data, setData, ready];
}
