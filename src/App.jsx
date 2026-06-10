import { useMemo, useState } from "react";

const STORAGE_KEY = "storytelling.savedClasses.v1";

const DEFAULT_CONFIG = {
  classNumber: "38",
  eventName: "Semana do Despertar",
  trackName: "Psicanálise",
  anchorProfessor: "Rodrygo Murari",
  guestProfessor: "Convidado(a) especial",
  slogan: "Excelente",
  preLaunchDays: 9,
  classTime: "20h",
  classTitles: ["O Despertar", "A Cura", "A Revelação"],
  classDates: ["2026-06-16", "2026-06-17", "2026-06-18"],
  classLinks: [
    "https://youtube.com/live/placeholder-aula-1",
    "https://youtube.com/live/placeholder-aula-2",
    "https://youtube.com/live/placeholder-aula-3",
  ],
};

const WEEKDAY = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

const typeColors = {
  manha: { bg: "rgba(251, 191, 36, 0.1)", border: "#f59e0b", label: "MANHÃ", labelBg: "#f59e0b" },
  enquete: { bg: "rgba(37, 99, 235, 0.1)", border: "#2563eb", label: "ENQUETE", labelBg: "#2563eb" },
  noite: { bg: "rgba(14, 116, 144, 0.08)", border: "#0e7490", label: "NOITE", labelBg: "#0e7490" },
  audio: { bg: "rgba(219, 39, 119, 0.1)", border: "#db2777", label: "ÁUDIO", labelBg: "#db2777" },
  contagem: { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", label: "CONTAGEM", labelBg: "#d97706" },
  live: { bg: "rgba(220, 38, 38, 0.14)", border: "#dc2626", label: "AO VIVO", labelBg: "#dc2626" },
  provocacao: { bg: "rgba(220, 38, 38, 0.09)", border: "#dc2626", label: "PROVOCAÇÃO", labelBg: "#b91c1c" },
};

const fieldStyle = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 7,
  padding: "8px 10px",
  fontSize: 13,
  color: "#0f172a",
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 5,
};

function readSavedClasses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function normalizeConfig(config) {
  const classDates = config.classDates?.length ? config.classDates : DEFAULT_CONFIG.classDates;
  const classTitles = classDates.map((_, index) => config.classTitles?.[index] || `Aula ${index + 1}`);
  const classLinks = classDates.map((_, index) => config.classLinks?.[index] || "");

  return {
    ...DEFAULT_CONFIG,
    ...config,
    preLaunchDays: Math.max(1, Number(config.preLaunchDays) || DEFAULT_CONFIG.preLaunchDays),
    classDates,
    classTitles,
    classLinks,
  };
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const weekday = WEEKDAY.format(date);
  const weekdayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${date.toLocaleDateString("pt-BR")} - ${weekdayLabel}`;
}

function shortDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

function addDays(dateString, offset) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function joinShortDates(dates) {
  if (dates.length <= 1) return shortDate(dates[0]);
  return `${dates.slice(0, -1).map(shortDate).join(", ")} e ${shortDate(dates.at(-1))}`;
}

function linkLabel(link, fallback) {
  return link?.trim() || fallback;
}

function buildPreLaunchDay(config, offset) {
  const firstClassDate = config.classDates[0];
  const date = addDays(firstClassDate, offset);
  const remaining = Math.abs(offset);
  const teachers = `${config.anchorProfessor} e ${config.guestProfessor}`;
  const firstLink = linkLabel(config.classLinks[0], "[link da Aula 1]");
  const schedule = config.classDates
    .map((classDate, index) => `📅 Aula ${index + 1} - *${config.classTitles[index]}* (${shortDate(classDate)})`)
    .join("\n");
  const reminderLinks = config.classDates
    .map((_, index) => `🔗 Aula ${index + 1}: ${linkLabel(config.classLinks[index], `[link da Aula ${index + 1}]`)}`)
    .join("\n");

  return {
    date: formatDate(date),
    label: remaining === 1 ? "Falta 1 dia - Véspera" : `Faltam ${remaining} dias`,
    messages: [
      {
        time: offset <= -7 ? "Manhã (~10h)" : "Manhã (~8h)",
        type: "manha",
        text:
          remaining === 1
            ? `${config.slogan} dia! ☀️

*Amanhã começa a ${config.eventName} - Turma ${config.classNumber}.*

Serão ${config.classDates.length} aulas ao vivo para mexer com a forma como cada pessoa se enxerga.

${config.anchorProfessor} conduz essa jornada com participação de ${config.guestProfessor}.

👉 Ativa o lembrete da Aula 1: ${firstLink}

Reage com um 🙌 se você vai estar ao vivo!`
            : `${config.slogan} dia! ☀️

Bem-vindo à Turma ${config.classNumber} da ${config.eventName}!

Faltam *${remaining} dias* para começarmos nossa jornada de autoconhecimento.

${schedule}

Sempre às *${config.classTime}*, ao vivo no YouTube.

Com ${teachers}.

👉 Ativa o lembrete da Aula 1: ${firstLink}

Reage com um ❤️ pra eu saber que você está aqui com a gente!`,
      },
      {
        time: remaining <= 2 ? "Tarde (~15h)" : "Tarde (~14h)",
        type: remaining % 3 === 0 ? "audio" : "enquete",
        text:
          remaining % 3 === 0
            ? `${config.slogan} tarde! ☀️

🎙️ *Áudio sugerido do Prof. ${config.anchorProfessor}:*

"${config.slogan}, pessoal da Turma ${config.classNumber}! Estamos chegando muito perto da nossa primeira aula. Quero te encontrar ao vivo no dia ${shortDate(config.classDates[0])}, às ${config.classTime}, para abrir essa jornada com profundidade e direção."

👉 ${firstLink}

Reage com um ❤️ depois de ouvir!`
            : `${config.slogan} tarde! ☀️

Uma pergunta rápida antes de começarmos essa jornada juntos:

*O que você mais busca na psicanálise neste momento?*

Seleciona a opção que mais combina com você 👇

Reage com um 💡 nessa mensagem!`,
        ...(remaining % 3 === 0
          ? { note: `Roteiro sugerido - gravar áudio real do ${config.anchorProfessor}` }
          : {
              pollTitle: "O que você mais busca na psicanálise neste momento?",
              pollOptions: [
                "Quero me conhecer melhor",
                "Quero ajudar pessoas ao meu redor",
                "Quero atuar com psicanálise",
                "Quero entender mais antes de decidir",
              ],
            }),
      },
      {
        time: `Noite (~${config.classTime})`,
        type: "noite",
        text:
          remaining === 1
            ? `${config.slogan} noite! 🌙

*AMANHÃ, ${config.classTime}. Ao vivo.*

Aula 1 - *${config.classTitles[0]}*.

Se você ativar só um lembrete agora, que seja esse:

👉 ${firstLink}

E já aproveita pra ativar os lembretes das próximas aulas:
${reminderLinks}

Reage com um 🚀 - amanhã a gente se encontra!`
            : `${config.slogan} noite! 🌙

Faltam *${remaining} dias* pra ${config.eventName} - Turma ${config.classNumber}.

${config.classDates.length} aulas ao vivo que podem mudar a forma como você se enxerga.

👉 Já ativa os lembretes e deixa o like:

${reminderLinks}

Reage com um 🔥 se você já está ansioso pra começar!`,
      },
    ],
  };
}

function buildClassDay(config, index) {
  const title = config.classTitles[index];
  const classLink = linkLabel(config.classLinks[index], `[link da Aula ${index + 1}]`);
  const classDate = config.classDates[index];
  const duoText = `${config.anchorProfessor} e ${config.guestProfessor}`;

  return {
    date: formatDate(classDate),
    label: `🔴 AULA ${index + 1} - ${title.toUpperCase()}`,
    messages: [
      {
        time: "Manhã (~8h)",
        type: "manha",
        text: `${config.slogan} dia! ☀️

*HOJE é o dia.*

Hoje às ${config.classTime} começa a Aula ${index + 1} - *${title}*.

${duoText} vão ao vivo conduzir essa experiência com a Turma ${config.classNumber}.

Separa o caderno. Avisa a família. Hoje você tem um compromisso com você mesmo.

👉 ${classLink}

Reage com um 🔥 se você vai estar lá HOJE!`,
      },
      {
        time: "Tarde (~14h)",
        type: "enquete",
        text: `${config.slogan} tarde! ☀️

Hoje às ${config.classTime} temos a Aula ${index + 1} - *${title}*! 🔴

*Como você está chegando para a aula de hoje?*

Seleciona a sua resposta 👇

Reage com um ✨ nessa mensagem!`,
        pollTitle: "Como você está chegando para a aula de hoje?",
        pollOptions: [
          "Ansioso - mal posso esperar",
          "Curioso - quero ver o que vai rolar",
          "Reflexivo - já cheguei pensando",
          "Pronto - bora viver isso ao vivo",
        ],
      },
      {
        time: "17h - Faltam 3 horas",
        type: "contagem",
        text: `⏰ *Faltam 3 HORAS pra Aula ${index + 1} - ${title}!*

Hoje às ${config.classTime}, ao vivo. Você não vai querer perder o início.

👉 ${classLink}

Reage com um ⏰!`,
      },
      {
        time: "18h - Faltam 2 horas",
        type: "contagem",
        text: `⏰ *Faltam 2 HORAS!*

Já separa o caderno, o fone e um lugar tranquilo. Essa aula pede atenção total.

👉 ${classLink}

Reage com um 📝!`,
      },
      {
        time: "19h - Falta 1 hora",
        type: "contagem",
        text: `⏰ *Falta 1 HORA pra começar!*

Daqui a 60 minutos, ${duoText} entram ao vivo.

👉 ${classLink}

Reage com um 🚀 se já está se preparando!`,
      },
      {
        time: `${config.classTime} - AO VIVO`,
        type: "live",
        text: `🔴 *ESTAMOS AO VIVO!*

Aula ${index + 1} - *${title}* - começou AGORA!

Corre pra não perder o início 👇

👉 ${classLink}

Reage com um ❤️ e entra AGORA!`,
      },
      {
        time: "20h10 - Provocação 1",
        type: "provocacao",
        text: `⚡ A aula já começou e a energia está absurda!

Se você ainda não entrou, esse é o momento. Vem 👇
👉 ${classLink}`,
      },
      {
        time: "20h20 - Provocação 2",
        type: "provocacao",
        text: `🧠 ${config.anchorProfessor} está ao vivo conduzindo pontos profundos agora.

Não deixa pra depois - entra agora 👇
👉 ${classLink}`,
      },
      {
        time: "20h30 - Provocação 3",
        type: "provocacao",
        text: `🌟 O ao vivo tem algo que o replay nunca vai te dar: a experiência de viver isso em tempo real.

Ainda dá tempo. Entra 👇
👉 ${classLink}`,
      },
      {
        time: "20h40 - Provocação 4 + Sorteio",
        type: "provocacao",
        text: `🎁 Atenção! Vai rolar *SORTEIO* pra quem está ao vivo!

Entra agora e ainda dá tempo de participar 👇
👉 ${classLink}`,
      },
    ],
  };
}

function buildDays(config) {
  const normalized = normalizeConfig(config);
  return [
    ...Array.from({ length: normalized.preLaunchDays }, (_, index) =>
      buildPreLaunchDay(normalized, index - normalized.preLaunchDays)
    ),
    ...normalized.classDates.map((_, index) => buildClassDay(normalized, index)),
  ];
}

function saveClasses(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function CopyBtn({ text, label, small }) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={doCopy}
      style={{
        background: copied ? "#16a34a" : small ? "#e0f2fe" : "#1e293b",
        color: copied ? "#fff" : small ? "#075985" : "#fff",
        border: "none",
        borderRadius: small ? 5 : 6,
        padding: small ? "3px 8px" : "5px 12px",
        fontSize: small ? 11 : 12,
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copiado!" : `📋 ${label || "Copiar"}`}
    </button>
  );
}

function ConfigPanel({ config, savedClasses, onConfigChange, onSave, onLoad, onDelete }) {
  const update = (field, value) => onConfigChange(normalizeConfig({ ...config, [field]: value }));
  const updateArray = (field, index, value) => {
    const next = [...config[field]];
    next[index] = value;
    onConfigChange(normalizeConfig({ ...config, [field]: next }));
  };
  const setClassCount = (count) => {
    const nextCount = Math.max(1, Number(count) || 1);
    const classDates = Array.from({ length: nextCount }, (_, index) => config.classDates[index] || addDays(config.classDates[0], index));
    const classTitles = Array.from({ length: nextCount }, (_, index) => config.classTitles[index] || `Aula ${index + 1}`);
    const classLinks = Array.from({ length: nextCount }, (_, index) => config.classLinks[index] || "");
    onConfigChange(normalizeConfig({ ...config, classDates, classTitles, classLinks }));
  };

  return (
    <div style={{ border: "1px solid #cbd5e1", borderRadius: 8, padding: 16, marginBottom: 18, background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#0f766e", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Configuração da turma
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Mude os campos e os textos se adaptam automaticamente.</div>
        </div>
        <button
          onClick={onSave}
          style={{ border: "none", borderRadius: 7, background: "#0f766e", color: "#fff", padding: "9px 14px", fontWeight: 800, cursor: "pointer" }}
        >
          Salvar turma
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 12 }}>
        <label>
          <span style={labelStyle}>Turma</span>
          <input style={fieldStyle} value={config.classNumber} onChange={(event) => update("classNumber", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Dias antes</span>
          <input style={fieldStyle} type="number" min="1" value={config.preLaunchDays} onChange={(event) => update("preLaunchDays", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Qtd. aulas</span>
          <input style={fieldStyle} type="number" min="1" value={config.classDates.length} onChange={(event) => setClassCount(event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Horário</span>
          <input style={fieldStyle} value={config.classTime} onChange={(event) => update("classTime", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Professor âncora</span>
          <input style={fieldStyle} value={config.anchorProfessor} onChange={(event) => update("anchorProfessor", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Participação</span>
          <input style={fieldStyle} value={config.guestProfessor} onChange={(event) => update("guestProfessor", event.target.value)} />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, marginBottom: 12 }}>
        <label>
          <span style={labelStyle}>Evento</span>
          <input style={fieldStyle} value={config.eventName} onChange={(event) => update("eventName", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Tema</span>
          <input style={fieldStyle} value={config.trackName} onChange={(event) => update("trackName", event.target.value)} />
        </label>
        <label>
          <span style={labelStyle}>Mantra</span>
          <input style={fieldStyle} value={config.slogan} onChange={(event) => update("slogan", event.target.value)} />
        </label>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        {config.classDates.map((classDate, index) => (
          <div key={index} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8, alignItems: "end", borderTop: index ? "1px solid #e2e8f0" : "none", paddingTop: index ? 8 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", paddingBottom: 9 }}>Aula {index + 1}</div>
            <label>
              <span style={labelStyle}>Data</span>
              <input style={fieldStyle} type="date" value={classDate} onChange={(event) => updateArray("classDates", index, event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Título</span>
              <input style={fieldStyle} value={config.classTitles[index]} onChange={(event) => updateArray("classTitles", index, event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Link YouTube</span>
              <input style={fieldStyle} value={config.classLinks[index]} onChange={(event) => updateArray("classLinks", index, event.target.value)} />
            </label>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 1fr) auto", gap: 8, alignItems: "end" }}>
        <label>
          <span style={labelStyle}>Turmas salvas neste navegador</span>
          <select style={fieldStyle} onChange={(event) => event.target.value && onLoad(event.target.value)} defaultValue="">
            <option value="">Abrir turma salva...</option>
            {savedClasses.map((item) => (
              <option key={item.id} value={item.id}>
                Turma {item.config.classNumber} - {item.config.eventName}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={onDelete}
          disabled={!savedClasses.length}
          style={{
            border: "1px solid #fecaca",
            borderRadius: 7,
            background: savedClasses.length ? "#fff1f2" : "#f1f5f9",
            color: savedClasses.length ? "#be123c" : "#94a3b8",
            padding: "9px 12px",
            fontWeight: 800,
            cursor: savedClasses.length ? "pointer" : "not-allowed",
          }}
        >
          Apagar turma atual
        </button>
      </div>
    </div>
  );
}

function PollBlock({ pollTitle, pollOptions }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "1px solid #bae6fd", borderRadius: 8, padding: "14px 16px", marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
        📊 Enquete - Copie o título e cada opção
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#fff", border: "2px solid #7dd3fc", borderRadius: 7, padding: "10px 12px", marginBottom: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.05em" }}>Título da enquete</span>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b", marginTop: 3 }}>{pollTitle}</div>
        </div>
        <CopyBtn text={pollTitle} label="Copiar" small />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {pollOptions.map((opt, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #bae6fd", borderRadius: 7, padding: "8px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              <span style={{ background: "#0369a1", color: "#fff", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, color: "#334155" }}>{opt}</span>
            </div>
            <CopyBtn text={opt} label="Copiar" small />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessageCard({ msg }) {
  const style = typeColors[msg.type] || typeColors.manha;

  return (
    <div style={{ background: style.bg, border: `1px solid ${style.border}33`, borderLeft: `4px solid ${style.border}`, borderRadius: 8, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: style.labelBg, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {style.label}
          </span>
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>{msg.time}</span>
        </div>
        <CopyBtn text={msg.text} label="Copiar texto" />
      </div>
      <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: 13.5, lineHeight: 1.65, color: "#1e293b", margin: 0, background: "rgba(255,255,255,0.62)", padding: 14, borderRadius: 7 }}>
        {msg.text}
      </pre>
      {msg.pollTitle && msg.pollOptions && <PollBlock pollTitle={msg.pollTitle} pollOptions={msg.pollOptions} />}
      {msg.note && <p style={{ fontSize: 11, color: "#64748b", fontStyle: "italic", margin: "8px 0 0", paddingLeft: 4 }}>ℹ️ {msg.note}</p>}
    </div>
  );
}

function DaySection({ day, isOpen, onToggle }) {
  const isLive = day.label.includes("🔴");

  return (
    <div style={{ marginBottom: 16, border: isLive ? "2px solid #dc2626" : "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", background: "#fff", boxShadow: isLive ? "0 0 20px rgba(220,38,38,0.1)" : "0 1px 4px rgba(15,23,42,0.05)" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: isLive ? "linear-gradient(135deg, #fef2f2, #fff1f2)" : "linear-gradient(135deg, #f8fafc, #f1f5f9)", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{day.date}</div>
          <div style={{ fontSize: 12, fontWeight: 800, color: isLive ? "#dc2626" : "#0f766e", marginTop: 2 }}>{day.label}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "#e2e8f0", borderRadius: 12, padding: "2px 8px", fontSize: 11, fontWeight: 800, color: "#475569" }}>{day.messages.length} msgs</span>
          <span style={{ fontSize: 18, color: "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
        </div>
      </button>
      {isOpen && <div style={{ padding: "14px 16px" }}>{day.messages.map((msg, i) => <MessageCard key={i} msg={msg} />)}</div>}
    </div>
  );
}

export default function App() {
  const [config, setConfig] = useState(() => normalizeConfig(DEFAULT_CONFIG));
  const [savedClasses, setSavedClasses] = useState(readSavedClasses);
  const [openDays, setOpenDays] = useState({ 0: true });
  const days = useMemo(() => buildDays(config), [config]);
  const totalMsgs = days.reduce((sum, day) => sum + day.messages.length, 0);

  const saveCurrentClass = () => {
    const normalized = normalizeConfig(config);
    const id = `turma-${normalized.classNumber}`;
    const savedItem = {
      id,
      savedAt: new Date().toISOString(),
      config: normalized,
      days: buildDays(normalized),
    };
    const next = [savedItem, ...savedClasses.filter((item) => item.id !== id)];
    setSavedClasses(next);
    saveClasses(next);
  };

  const loadClass = (id) => {
    const item = savedClasses.find((saved) => saved.id === id);
    if (!item) return;
    setConfig(normalizeConfig(item.config));
    setOpenDays({ 0: true });
  };

  const deleteCurrentClass = () => {
    const id = `turma-${config.classNumber}`;
    const next = savedClasses.filter((item) => item.id !== id);
    setSavedClasses(next);
    saveClasses(next);
  };

  const expandAll = () => {
    const all = {};
    days.forEach((_, i) => {
      all[i] = true;
    });
    setOpenDays(all);
  };

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "18px 12px 24px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0f766e, #0369a1, #0284c7)", borderRadius: 16, padding: "28px 24px", marginBottom: 20, color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#a7f3d0", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Storytelling Completo</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px", letterSpacing: 0 }}>Turma {config.classNumber}</h1>
        <p style={{ fontSize: 14, color: "#d9f99d", margin: "0 0 14px" }}>
          {config.eventName} - {config.trackName}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[{ n: days.length, l: "Dias" }, { n: totalMsgs, l: "Mensagens" }, { n: config.classDates.length, l: "Aulas" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.13)", borderRadius: 8, padding: "8px 14px", minWidth: 58 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "#cffafe", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <ConfigPanel config={config} savedClasses={savedClasses} onConfigChange={setConfig} onSave={saveCurrentClass} onLoad={loadClass} onDelete={deleteCurrentClass} />

      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 12.5, color: "#166534", lineHeight: 1.6 }}>
        <strong>📌 Resumo:</strong> Aulas {joinShortDates(config.classDates)} às {config.classTime} · Professor âncora: {config.anchorProfessor} · Participação: {config.guestProfessor} · Mantra: "{config.slogan}" · Grupo fechado
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={expandAll} style={{ flex: 1, padding: "8px 0", background: "#0369a1", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
          Abrir todos
        </button>
        <button onClick={() => setOpenDays({})} style={{ flex: 1, padding: "8px 0", background: "#e2e8f0", color: "#475569", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
          Fechar todos
        </button>
      </div>

      {days.map((day, i) => (
        <DaySection key={`${day.date}-${i}`} day={day} isOpen={!!openDays[i]} onToggle={() => setOpenDays((prev) => ({ ...prev, [i]: !prev[i] }))} />
      ))}

      <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 11, color: "#94a3b8" }}>
        Turma {config.classNumber} - {config.eventName} · {config.anchorProfessor} + {config.guestProfessor}
      </div>
    </div>
  );
}
