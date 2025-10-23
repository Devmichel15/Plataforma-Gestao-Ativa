import { useState, useEffect, useRef } from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import { useNavigate } from "react-router-dom";
import "../styles/chatbot.css";

function Chatbot() {
  const {
    mensagens,
    setMensagens,
    adicionarTransacao,
    dadosCliente,
    setDadosCliente,
    transacoes,
  } = useFinanceData();

  const [inputValue, setInputValue] = useState("");
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [modoOnboarding, setModoOnboarding] = useState(!dadosCliente?.nome);
  const [notificacao, setNotificacao] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const perguntasInicio = [
    "Qual é o seu nome?",
    "Em qual área você trabalha?",
    "Quais são os seus objetivos com o uso da Gestão Activa?",
  ];

  /* === MENSAGENS INICIAIS === */
  useEffect(() => {
    if (!mensagens.length) {
      if (dadosCliente?.nome) {
        setMensagens([
          { from: "bot", text: `👋 Olá, ${dadosCliente.nome}!` },
          {
            from: "bot",
            text: "Sou o Gestor Ativo — teu consultor virtual. Vamos aumentar os teus lucros hoje?",
          },
        ]);
      } else {
        setMensagens([
          {
            from: "bot",
            text: `👋 Olá! Sou o <b>Gestor Ativo</b>, teu assistente virtual da Gestão Activa.`,
          },
          { from: "bot", text: perguntasInicio[0] },
        ]);
        setModoOnboarding(true);
      }
    }
  }, []);

  /* === SCROLL AUTOMÁTICO === */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  /* === AJUSTE MOBILE === */
  useEffect(() => {
    const handleResize = () => {
      const isKeyboardOpen = window.innerHeight < window.outerHeight - 150;
      document.body.classList.toggle("keyboard-open", isKeyboardOpen);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* === SOM SEM ARQUIVO (Web Audio API) === */
  const tocarSom = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime); // volume suave
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  /* === MOSTRAR NOTIFICAÇÃO === */
  const mostrarNotificacao = (msg) => {
    setNotificacao(msg);
    tocarSom();
    setTimeout(() => setNotificacao(null), 4000);
  };

  /* === ENVIAR MENSAGEM === */
  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMensagens((prev) => [...prev, { from: "user", text: trimmed }]);
    setInputValue("");

    // === ONBOARDING ===
    if (modoOnboarding) {
      const chaves = ["nome", "area", "objetivos"];
      const chave = chaves[indicePergunta];
      const novoCliente = { ...dadosCliente, [chave]: trimmed };
      setDadosCliente(novoCliente);

      if (indicePergunta + 1 < perguntasInicio.length) {
        setTimeout(() => {
          setMensagens((prev) => [
            ...prev,
            { from: "bot", text: perguntasInicio[indicePergunta + 1] },
          ]);
        }, 600);
        setIndicePergunta(indicePergunta + 1);
      } else {
        setTimeout(() => {
          setMensagens((prev) => [
            ...prev,
            { from: "bot", text: `✅ Perfeito, ${novoCliente.nome}!` },
            {
              from: "bot",
              text: "Agora posso registrar ganhos, gastos e gerar relatórios inteligentes.",
            },
            {
              from: "bot",
              text: `💡 Dica: diga <b>“Quero minha análise financeira”</b> ou <b>“Resumo do mês”</b>.`,
            },
          ]);
          setModoOnboarding(false);
        }, 800);
      }
      return;
    }

    const lower = trimmed.toLowerCase();

    // === GASTO ===
    if (lower.includes("gastei") || lower.includes("gasto")) {
      const valor = trimmed.match(/\d+/);
      if (valor) {
        adicionarTransacao("gasto", Number(valor[0]), "Sem descrição");
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `📉 Gasto de ${valor[0]} kz registrado.` },
        ]);
        mostrarNotificacao(`💸 Gasto de <b>${valor[0]} kz</b> adicionado.`);
      } else {
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `💬 Qual o valor do gasto?` },
        ]);
      }
      return;
    }

    // === GANHO ===
    if (lower.includes("ganhei") || lower.includes("recebi")) {
      const valor = trimmed.match(/\d+/);
      if (valor) {
        adicionarTransacao("ganho", Number(valor[0]), "Sem descrição");
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `💰 Ganho de ${valor[0]} kz registrado.` },
        ]);
        mostrarNotificacao(`📈 Ganho de <b>${valor[0]} kz</b> adicionado.`);
      } else {
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `💬 Qual foi o valor do ganho?` },
        ]);
      }
      return;
    }

    // === ANÁLISE ===
    if (lower.includes("análise") || lower.includes("resumo")) {
      gerarAnaliseInteligente();
      return;
    }

    // === DASHBOARD ===
    if (lower.includes("dashboard") || lower.includes("painel")) {
      setMensagens((prev) => [
        ...prev,
        { from: "bot", text: `🔗 A abrir o teu dashboard...` },
      ]);
      setTimeout(() => navigate("/dashboard"), 1000);
      return;
    }

    // === PADRÃO ===
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text:
          `ℹ️ Posso registrar ganhos e gastos, mostrar teu dashboard ou fazer uma <b>análise</b>.<br>` +
          `Ex: <em>“Ganhei 15000”</em> ou <em>“Faz uma análise do mês”</em>.`,
      },
    ]);
  };

  /* === ANÁLISE === */
  const gerarAnaliseInteligente = () => {
    if (!transacoes.length) {
      setMensagens((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            `📊 Ainda não tens dados suficientes para análise.<br>` +
            `Registra alguns ganhos e gastos primeiro.`,
        },
      ]);
      return;
    }

    const ganhos = transacoes
      .filter((t) => t.tipo === "ganho")
      .reduce((acc, cur) => acc + cur.valor, 0);
    const gastos = transacoes
      .filter((t) => t.tipo === "gasto")
      .reduce((acc, cur) => acc + cur.valor, 0);
    const saldo = ganhos - gastos;
    const tendencia =
      saldo > 0 ? "🟢 Lucro" : saldo < 0 ? "🔴 Prejuízo" : "🟡 Equilíbrio";

    const analise = `
      <div class="analise-card">
        <h4>📈 Resumo Financeiro</h4>
        <p>💰 Ganhos: <b>${ganhos.toLocaleString()} kz</b></p>
        <p>📉 Gastos: <b>${gastos.toLocaleString()} kz</b></p>
        <p>📊 Saldo: <b>${saldo.toLocaleString()} kz</b></p>
        <p>Status atual: ${tendencia}</p>
      </div>
    `;

    const dica =
      saldo > 0
        ? "Excelente! Considere reinvestir parte dos lucros."
        : saldo < 0
        ? "Atenção! Os gastos ultrapassam os ganhos. Reveja custos fixos."
        : "Equilíbrio atingido! Agora é hora de crescer receitas.";

    setMensagens((prev) => [
      ...prev,
      { from: "bot", text: analise },
      { from: "bot", text: `💡 ${dica}` },
    ]);

    if (saldo < 500) {
      mostrarNotificacao(`⚠️ O teu saldo está abaixo de <b>500 kz</b>!`);
    }
  };

  return (
    <div className="app">
      {notificacao && (
        <div
          className="notification-popup"
          dangerouslySetInnerHTML={{ __html: notificacao }}
        />
      )}

      <header className="header">
        <h1>🤖 Gestor Ativo — Chat de Gestão</h1>
        <button onClick={() => navigate("/")}>🏠 Início</button>
      </header>

      <main className="container-messages">
        <div className="messages">
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={`msg ${msg.from === "user" ? "user" : "bot"}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="form-messages">
          <input
            className="inputText"
            type="text"
            placeholder="Digite aqui..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button id="send-button" onClick={handleSendMessage}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
