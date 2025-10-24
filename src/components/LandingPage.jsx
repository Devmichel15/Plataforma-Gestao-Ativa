import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useEffect, useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { dadosCliente } = useFinanceData();

  // 🔹 Detecta se o usuário já está registado
  useEffect(() => {
    if (dadosCliente && dadosCliente.nome) {
      console.log("Usuário ativo:", dadosCliente.nome);
    }
  }, [dadosCliente]);

  // 🔹 Detecta rolagem para aplicar efeito no header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const irParaChat = () => navigate("/chatbot");
  const irParaLogin = () => navigate("/sign");
  const irParaDashboard = () => navigate("/dashboard");

  return (
    <div className="landing">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="brand">
          <h1>
            Gestão <span>Ativa</span>
          </h1>
        </div>

        <nav className="nav">
          {dadosCliente ? (
            <button className="btn-nav" onClick={irParaDashboard}>
              Acessar Dashboard
            </button>
          ) : (
            <button className="btn-nav" onClick={irParaLogin}>
              Entrar
            </button>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          {dadosCliente ? (
            <>
              <h2>
                Bem-vindo de volta, <span>{dadosCliente.nome}</span> 👋
              </h2>
              <p>
                Pronto para continuar a gerir suas finanças com eficiência?
                Acesse seu painel e veja seus resultados.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={irParaDashboard}>
                  Ir para o Dashboard
                </button>

              </div>
            </>
          ) : (
            <>
              <h2>
                A forma moderna de <span>gerir e automatizar</span> seu negócio.
              </h2>
              <p>
                Simplifique suas operações, tome decisões com dados e concentre-se
                no que realmente importa: crescer de forma inteligente.
              </p>
              <div className="hero-buttons">
                <button onClick={irParaLogin}>
                  Começar agora
                </button>
                <button onClick={irParaDashboard}>
                  <i className="fi fi-sr-chart-pie-alt"></i> Dashboard
                </button>
                <button onClick={() => navigate("/produtos")}>
                  <i className="fi fi-sr-box"></i> Produtos
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="hero-visual">
        <div className="mockup">
          <h3>Dashboard Inteligente</h3>
          <p>Veja tudo em tempo real com gráficos dinâmicos e insights claros.</p>
        </div>
      </div>

      <button className="chat-button" onClick={irParaChat}>
        <i className="fi fi-sr-comment-alt"></i> Chatbot
      </button>
    </div>
  );
}

export default LandingPage;
