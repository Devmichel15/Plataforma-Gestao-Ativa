import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useEffect, useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const irParaChat = () => {
    navigate("/chatbot");
  };

  // Detecta rolagem para aplicar efeito no header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="brand">
          <h1>
            Gestão <span>Ativa</span>
          </h1>
        </div>

        <nav className="nav">

          <button className="btn-nav" onClick={irParaChat}>
            Entrar
          </button>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h2>
            A forma moderna de <span>gerir e automatizar</span> seu negócio.
          </h2>
          <p>
            Simplifique suas operações, tome decisões com dados e concentre-se
            no que realmente importa: crescer de forma inteligente.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">
              Começar agora
            </button>
            <button onClick={() => navigate("/dashboard")}>
              <i className="fi fi-sr-chart-pie-alt"></i> Dashboard
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="mockup">
            <h3>Dashboard Inteligente</h3>
            <p>
              Veja tudo em tempo real com gráficos dinâmicos e insights claros.
            </p>
          </div>
        </div>
      </section>

      <button className="chat-button" onClick={irParaChat}>
        <i className="fi fi-sr-comment-alt"></i> Chatbot
      </button>
    </div>
  );
}

export default LandingPage;
