import { useState, useEffect } from "react";


function Chatbot() {
  const perguntasInicio = [
    "Qual é o seu nome?",
    "Em qual área você trabalha?",
    "Quais são os seus objetivos para com o uso da Gestão Activa?",
  ];

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [indicePergunta, setIndicePergunta] = useState(0);
  const [modoOnboarding, setModoOnboarding] = useState(false);
  const [respostas, setRespostas] = useState({});

  // Quando o site carrega
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("dadosCliente");

    if (dadosSalvos) {
      const userData = JSON.parse(dadosSalvos);
      setMessages([
        {
          from: "bot",
          text: `Olá, ${userData.nome}! 👋 Bem-vindo de volta à Gestão Activa.`,
        },
        {
          from: "bot",
          text: "Posso te ajudar a acompanhar seus ganhos e despesas hoje?",
        },
      ]);
    } else {
      // Primeira visita → inicia perguntas
      setModoOnboarding(true);
      setMessages([
        {
          from: "bot",
          text: "Olá! 👋 Sou o assistente virtual da Gestão Activa. Antes de começarmos, quero te conhecer melhor.",
        },
        { from: "bot", text: perguntasInicio[0] },
      ]);
    }
  }, []);

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Se estamos no modo de perguntas iniciais
    if (modoOnboarding) {
      const chave =
        indicePergunta === 0
          ? "nome"
          : indicePergunta === 1
          ? "area"
          : "objetivos";

      setRespostas((prev) => ({ ...prev, [chave]: trimmed }));

      const proximaPergunta = indicePergunta + 1;

      setTimeout(() => {
        if (proximaPergunta < perguntasInicio.length) {
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: perguntasInicio[proximaPergunta] },
          ]);
          setIndicePergunta(proximaPergunta);
        } else {
          // Finaliza o onboarding
          localStorage.setItem(
            "dadosCliente",
            JSON.stringify({ ...respostas, [chave]: trimmed })
          );

          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: `Perfeito, ${respostas.nome || trimmed}! 😊 Obrigado por compartilhar.`,
            },
            {
              from: "bot",
              text: "Agora posso te ajudar com relatórios, despesas e muito mais. Como posso ajudar hoje?",
            },
          ]);
          setModoOnboarding(false);
        }
      }, 800);
    } else {
      // Resposta normal do bot
      setTimeout(() => {
        const botMsg = {
          from: "bot",
          text: "Boa noite, Michel. \nHoje os teus gastos estão superiores aos teus ganhos. \nTenciona diminuir mais? Posso te ajudar com isso.",
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="app">
      <header>
        <h1>🤖 Chatbot — Gestão Activa</h1>
      </header>

      <main className="container-messages">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className={msg.from === "user" ? "user" : "bot"}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="form-messages">
          <input
            type="text"
            placeholder="Escreva algo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;
