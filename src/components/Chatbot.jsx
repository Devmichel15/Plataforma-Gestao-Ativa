import { useState, useEffect } from "react";
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
  } = useFinanceData();

  const [inputValue, setInputValue] = useState("");
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [modoOnboarding, setModoOnboarding] = useState(!dadosCliente?.nome);
  const navigate = useNavigate();

  const perguntasInicio = [
    "Qual é o seu nome?",
    "Em qual área você trabalha?",
    "Quais são os seus objetivos com o uso da Gestão Activa?",
  ];

  // Exibe mensagens iniciais
  useEffect(() => {
    if (!mensagens.length) {
      if (dadosCliente?.nome) {
        setMensagens([
          {
            from: "bot",
            text: `<i class="fi fi-sr-hand-wave"></i> Olá, ${dadosCliente.nome}! Bem-vindo de volta.`,
          },
          { from: "bot", text: "Como posso te ajudar hoje?" },
        ]);
      } else {
        setMensagens([
          {
            from: "bot",
            text: `<i class="fi fi-sr-hand-wave"></i> Olá! Sou o assistente virtual da Gestão Activa. Vamos nos conhecer melhor.`,
          },
          { from: "bot", text: perguntasInicio[0] },
        ]);
        setModoOnboarding(true);
      }
    }
  }, []);

  // Enviar mensagem
  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMensagens((prev) => [...prev, { from: "user", text: trimmed }]);
    setInputValue("");

    // === MODO ONBOARDING ===
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
            {
              from: "bot",
              text: `<i class="fi fi-sr-badge-check"></i> Perfeito, ${novoCliente.nome}!`,
            },
            {
              from: "bot",
              text: "Agora posso te ajudar a registrar ganhos e gastos ou mostrar teu dashboard.",
            },
          ]);
          setModoOnboarding(false);
        }, 800);
      }
      return;
    }

    // === COMANDOS ===
    const lower = trimmed.toLowerCase();

    // Registrar gasto
    if (lower.includes("gastei") || lower.includes("gasto")) {
      const valor = trimmed.match(/\d+/);
      if (valor) {
        adicionarTransacao("gasto", Number(valor[0]), "Sem descrição");
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `📉 Gasto de ${valor[0]} kz registrado.` },
        ]);
      } else {
        setMensagens((p) => [
          ...p,
          {
            from: "bot",
            text: `<i class="fi fi-sr-comment-dollar"></i> Qual o valor do gasto?`,
          },
        ]);
      }
      return;
    }

    // Registrar ganho
    if (lower.includes("ganhei") || lower.includes("recebi")) {
      const valor = trimmed.match(/\d+/);
      if (valor) {
        adicionarTransacao("ganho", Number(valor[0]), "Sem descrição");
        setMensagens((p) => [
          ...p,
          { from: "bot", text: `💰 Ganho de ${valor[0]} kz registrado.` },
        ]);
      } else {
        setMensagens((p) => [
          ...p,
          {
            from: "bot",
            text: `<i class="fi fi-sr-money"></i> Qual foi o valor do ganho?`,
          },
        ]);
      }
      return;
    }

    // Abrir dashboard
    if (lower.includes("dashboard") || lower.includes("painel")) {
      setMensagens((prev) => [
        ...prev,
        {
          from: "bot",
          text: `<i class="fi fi-sr-link-alt"></i> A abrir o teu dashboard...`,
        },
      ]);
      setTimeout(() => navigate("/dashboard"), 1000);
      return;
    }

    // Resposta padrão
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text:
          `<i class="fi fi-sr-info"></i> Posso registrar ganhos e gastos, mostrar teu dashboard, fazer uma análise ou dar uma dica.<br>` +
          `Ex: <em>“Ganhei 10000”</em> ou <em>“Mostra meu resumo financeiro”</em>.`,
      },
    ]);
  };

  return (
    <div className="app">
      <header className="header">
        <i className="fi fi-sr-robot"></i> Chatbot — Gestão Ativa
        <button onClick={() => navigate("/")}>
          <i className="fi fi-sr-home"></i> Início
        </button>
      </header>

      <main className="container-messages">
        <div className="messages">
          {mensagens.map((msg, i) => (
            <div
              key={i}
              className={msg.from === "user" ? "user" : "bot"}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
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
            <i className="fi fi-sr-paper-plane"></i>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
