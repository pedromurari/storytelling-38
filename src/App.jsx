import { useState } from "react";

const CONFIG = {
  classNumber: "38",
  eventName: "Semana do Despertar",
  trackName: "Psicanálise",
  anchorProfessor: "Rodrygo Murari",
  guestProfessor: "Convidado(a) especial",
  slogan: "Excelente",
  classLinks: [
    "https://youtube.com/live/placeholder-aula-1",
    "https://youtube.com/live/placeholder-aula-2",
    "https://youtube.com/live/placeholder-aula-3",
  ],
  classTitles: ["O Despertar", "A Cura", "A Revelação"],
  classDates: ["2026-06-16", "2026-06-17", "2026-06-18"],
};

const WEEKDAY = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

const typeColors = {
  manha: { bg: "rgba(251, 191, 36, 0.1)", border: "#f59e0b", label: "MANHÃ", labelBg: "#f59e0b" },
  enquete: { bg: "rgba(99, 102, 241, 0.1)", border: "#6366f1", label: "ENQUETE", labelBg: "#6366f1" },
  noite: { bg: "rgba(99, 102, 241, 0.08)", border: "#4f46e5", label: "NOITE", labelBg: "#4f46e5" },
  audio: { bg: "rgba(236, 72, 153, 0.1)", border: "#ec4899", label: "ÁUDIO", labelBg: "#ec4899" },
  contagem: { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", label: "CONTAGEM", labelBg: "#d97706" },
  live: { bg: "rgba(239, 68, 68, 0.15)", border: "#ef4444", label: "AO VIVO", labelBg: "#ef4444" },
  provocacao: { bg: "rgba(239, 68, 68, 0.1)", border: "#ef4444", label: "PROVOCAÇÃO", labelBg: "#dc2626" },
};

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

function buildPreLaunchDay(offset) {
  const firstClassDate = CONFIG.classDates[0];
  const date = addDays(firstClassDate, offset);
  const remaining = Math.abs(offset);
  const teachers = `${CONFIG.anchorProfessor} e ${CONFIG.guestProfessor}`;

  return {
    date: formatDate(date),
    label: remaining === 1 ? "Falta 1 dia - Véspera" : `Faltam ${remaining} dias`,
    messages: [
      {
        time: offset <= -7 ? "Manhã (~10h)" : "Manhã (~8h)",
        type: "manha",
        text:
          remaining === 1
            ? `Excelente dia! ☀️

*Amanhã começa a ${CONFIG.eventName} - Turma ${CONFIG.classNumber}.*

Serão três aulas ao vivo para mexer com a forma como cada pessoa se enxerga.

${CONFIG.anchorProfessor} conduz essa jornada com participação de ${CONFIG.guestProfessor}.

👉 Ativa o lembrete da Aula 1: ${CONFIG.classLinks[0]}

Reage com um 🙌 se você vai estar ao vivo!`
            : `Excelente dia! ☀️

Bem-vindo à Turma ${CONFIG.classNumber} da ${CONFIG.eventName}!

Faltam *${remaining} dias* para começarmos nossa jornada de autoconhecimento.

📅 Aula 1 - *${CONFIG.classTitles[0]}* (${shortDate(CONFIG.classDates[0])})
📅 Aula 2 - *${CONFIG.classTitles[1]}* (${shortDate(CONFIG.classDates[1])})
📅 Aula 3 - *${CONFIG.classTitles[2]}* (${shortDate(CONFIG.classDates[2])})

Sempre às *20h*, ao vivo no YouTube.

Com ${teachers}.

👉 Ativa o lembrete da Aula 1: ${CONFIG.classLinks[0]}

Reage com um ❤️ pra eu saber que você está aqui com a gente!`,
      },
      {
        time: remaining <= 2 ? "Tarde (~15h)" : "Tarde (~14h)",
        type: remaining % 3 === 0 ? "audio" : "enquete",
        text:
          remaining % 3 === 0
            ? `Excelente tarde! ☀️

🎙️ *Áudio sugerido do Prof. ${CONFIG.anchorProfessor}:*

"Excelente, pessoal da Turma ${CONFIG.classNumber}! Estamos chegando muito perto da nossa primeira aula. Quero te encontrar ao vivo no dia ${shortDate(CONFIG.classDates[0])}, às 20h, para abrir essa jornada com profundidade e direção."

👉 ${CONFIG.classLinks[0]}

Reage com um ❤️ depois de ouvir!`
            : `Excelente tarde! ☀️

Uma pergunta rápida antes de começarmos essa jornada juntos:

*O que você mais busca na psicanálise neste momento?*

Seleciona a opção que mais combina com você 👇

Reage com um 💡 nessa mensagem!`,
        ...(remaining % 3 === 0
          ? { note: "Roteiro sugerido - gravar áudio real do Rodrygo" }
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
        time: "Noite (~20h)",
        type: "noite",
        text:
          remaining === 1
            ? `Excelente noite! 🌙

*AMANHÃ, 20h. Ao vivo.*

Aula 1 - *${CONFIG.classTitles[0]}*.

Se você ativar só um lembrete agora, que seja esse:

👉 ${CONFIG.classLinks[0]}

E já aproveita pra ativar os lembretes das outras duas:
🔗 Aula 2 - ${CONFIG.classTitles[1]}: ${CONFIG.classLinks[1]}
🔗 Aula 3 - ${CONFIG.classTitles[2]}: ${CONFIG.classLinks[2]}

Reage com um 🚀 - amanhã a gente se encontra!`
            : `Excelente noite! 🌙

Faltam *${remaining} dias* pra ${CONFIG.eventName} - Turma ${CONFIG.classNumber}.

Três aulas ao vivo que podem mudar a forma como você se enxerga.

👉 Já ativa os lembretes e deixa o like nas três aulas:

🔗 Aula 1: ${CONFIG.classLinks[0]}
🔗 Aula 2: ${CONFIG.classLinks[1]}
🔗 Aula 3: ${CONFIG.classLinks[2]}

Reage com um 🔥 se você já está ansioso pra começar!`,
      },
    ],
  };
}

function buildClassDay(index) {
  const title = CONFIG.classTitles[index];
  const classLink = CONFIG.classLinks[index];
  const classDate = CONFIG.classDates[index];
  const duoText = `${CONFIG.anchorProfessor} e ${CONFIG.guestProfessor}`;

  return {
    date: formatDate(classDate),
    label: `🔴 AULA ${index + 1} - ${title.toUpperCase()}`,
    messages: [
      {
        time: "Manhã (~8h)",
        type: "manha",
        text: `Excelente dia! ☀️

*HOJE é o dia.*

Hoje às 20h começa a Aula ${index + 1} - *${title}*.

${duoText} vão ao vivo conduzir essa experiência com a Turma ${CONFIG.classNumber}.

Separa o caderno. Avisa a família. Hoje você tem um compromisso com você mesmo.

👉 ${classLink}

Reage com um 🔥 se você vai estar lá HOJE!`,
      },
      {
        time: "Tarde (~14h)",
        type: "enquete",
        text: `Excelente tarde! ☀️

Hoje às 20h temos a Aula ${index + 1} - *${title}*! 🔴

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

Hoje às 20h, ao vivo. Você não vai querer perder o início.

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
        time: "20h - AO VIVO",
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
        text: `🧠 ${CONFIG.anchorProfessor} está ao vivo conduzindo pontos profundos agora.

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

const DAYS = [
  ...Array.from({ length: 9 }, (_, index) => buildPreLaunchDay(index - 9)),
  ...CONFIG.classDates.map((_, index) => buildClassDay(index)),
];

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
        background: copied ? "#22c55e" : small ? "#e0e7ff" : "#1e293b",
        color: copied ? "#fff" : small ? "#4338ca" : "#fff",
        border: "none",
        borderRadius: small ? 5 : 6,
        padding: small ? "3px 8px" : "5px 12px",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copiado!" : `📋 ${label || "Copiar"}`}
    </button>
  );
}

function PollBlock({ pollTitle, pollOptions }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        border: "1px solid #c7d2fe",
        borderRadius: 10,
        padding: "14px 16px",
        marginTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6366f1",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 10,
        }}
      >
        📊 Enquete - Copie o título e cada opção
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          background: "#fff",
          border: "2px solid #a5b4fc",
          borderRadius: 8,
          padding: "10px 12px",
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#6366f1",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Título da enquete
          </span>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", marginTop: 3 }}>{pollTitle}</div>
        </div>
        <CopyBtn text={pollTitle} label="Copiar" small />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {pollOptions.map((opt, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              border: "1px solid #ddd6fe",
              borderRadius: 7,
              padding: "8px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
              <span
                style={{
                  background: "#6366f1",
                  color: "#fff",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
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
    <div
      style={{
        background: style.bg,
        border: `1px solid ${style.border}33`,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: 12,
        padding: "16px 18px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              background: style.labelBg,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 4,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {style.label}
          </span>
          <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{msg.time}</span>
        </div>
        <CopyBtn text={msg.text} label="Copiar texto" />
      </div>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          fontSize: 13.5,
          lineHeight: 1.65,
          color: "#1e293b",
          margin: 0,
          background: "rgba(255,255,255,0.5)",
          padding: 14,
          borderRadius: 8,
        }}
      >
        {msg.text}
      </pre>
      {msg.pollTitle && msg.pollOptions && <PollBlock pollTitle={msg.pollTitle} pollOptions={msg.pollOptions} />}
      {msg.note && (
        <p style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", margin: "8px 0 0", paddingLeft: 4 }}>
          ℹ️ {msg.note}
        </p>
      )}
    </div>
  );
}

function DaySection({ day, isOpen, onToggle }) {
  const isLive = day.label.includes("🔴");

  return (
    <div
      style={{
        marginBottom: 16,
        border: isLive ? "2px solid #ef4444" : "1px solid #e2e8f0",
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        boxShadow: isLive ? "0 0 20px rgba(239,68,68,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          background: isLive ? "linear-gradient(135deg, #fef2f2, #fff1f2)" : "linear-gradient(135deg, #f8fafc, #f1f5f9)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{day.date}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: isLive ? "#ef4444" : "#6366f1", marginTop: 2 }}>
            {day.label}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              background: "#e2e8f0",
              borderRadius: 12,
              padding: "2px 8px",
              fontSize: 11,
              fontWeight: 600,
              color: "#475569",
            }}
          >
            {day.messages.length} msgs
          </span>
          <span
            style={{
              fontSize: 18,
              color: "#94a3b8",
              transition: "transform 0.2s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0)",
            }}
          >
            ▼
          </span>
        </div>
      </button>
      {isOpen && <div style={{ padding: "14px 16px" }}>{day.messages.map((msg, i) => <MessageCard key={i} msg={msg} />)}</div>}
    </div>
  );
}

export default function App() {
  const [openDays, setOpenDays] = useState({ 0: true });
  const toggleDay = (i) => setOpenDays((prev) => ({ ...prev, [i]: !prev[i] }));
  const expandAll = () => {
    const all = {};
    DAYS.forEach((_, i) => {
      all[i] = true;
    });
    setOpenDays(all);
  };
  const collapseAll = () => setOpenDays({});
  const totalMsgs = DAYS.reduce((sum, d) => sum + d.messages.length, 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #0c4a6e, #0369a1, #0284c7)",
          borderRadius: 16,
          padding: "28px 24px",
          marginBottom: 20,
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#7dd3fc",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Storytelling Completo
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Turma {CONFIG.classNumber}
        </h1>
        <p style={{ fontSize: 14, color: "#bae6fd", margin: "0 0 14px" }}>
          {CONFIG.eventName} - {CONFIG.trackName}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          {[{ n: DAYS.length, l: "Dias" }, { n: totalMsgs, l: "Mensagens" }, { n: 3, l: "Aulas" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 8, padding: "8px 14px" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{s.n}</div>
              <div style={{ fontSize: 10, color: "#bae6fd", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 16,
          fontSize: 12.5,
          color: "#166534",
          lineHeight: 1.6,
        }}
      >
        <strong>📌 Resumo:</strong> Aulas {shortDate(CONFIG.classDates[0])}, {shortDate(CONFIG.classDates[1])} e{" "}
        {shortDate(CONFIG.classDates[2])} às 20h · Professor âncora: {CONFIG.anchorProfessor} · Participação:{" "}
        {CONFIG.guestProfessor} · Mantra: "{CONFIG.slogan}" · Grupo fechado
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={expandAll}
          style={{
            flex: 1,
            padding: "8px 0",
            background: "#0369a1",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Abrir todos
        </button>
        <button
          onClick={collapseAll}
          style={{
            flex: 1,
            padding: "8px 0",
            background: "#e2e8f0",
            color: "#475569",
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Fechar todos
        </button>
      </div>

      {DAYS.map((day, i) => (
        <DaySection key={i} day={day} isOpen={!!openDays[i]} onToggle={() => toggleDay(i)} />
      ))}

      <div style={{ textAlign: "center", padding: "20px 0 8px", fontSize: 11, color: "#94a3b8" }}>
        Turma {CONFIG.classNumber} - {CONFIG.eventName} · {CONFIG.anchorProfessor} + {CONFIG.guestProfessor}
      </div>
    </div>
  );
}
