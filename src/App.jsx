import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Olá! 👋 Sou o assistente virtual da Gestão Activa. Como posso ajudar hoje?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // adiciona mensagem do usuário
    const userMsg = { from: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);

    // simula resposta do bot (podes conectar depois à tua API)
    setTimeout(() => {
      const botMsg = {
        from: "bot",
        text: "Entendido! 💬 Estou processando sua solicitação...",
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);

    setInputValue("");
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
            <div
              key={index}
              className={msg.from === "user" ? "user" : "bot"}
            >
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

export default App;
