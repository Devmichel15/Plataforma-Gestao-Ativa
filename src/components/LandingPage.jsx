import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const irParaChat = () => {
    navigate("/chatbot");
  };

  return (
    <div className="landing">
      <header>
        <h1>Gestão Ativa</h1>
        <p>Transforme dados em decisões inteligentes.</p>
      </header>

      <button className="chat-button" onClick={irParaChat}>
        💬 Abrir Chat
      </button>
    </div>
  );
}

export default LandingPage;