import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useEffect, useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");
  const { dadosCliente, loadingCliente } = useFinanceData(); // ✅ use loadingCliente

  // ✅ Atualiza o nome do usuário sempre que dadosCliente mudar ou houver localStorage
  useEffect(() => {
    const carregarNome = () => {
      if (dadosCliente && dadosCliente.nome) {
        setUserName(dadosCliente.nome);
        console.log("✅ Usuário ativo (IndexedDB):", dadosCliente.nome);
        return;
      }

      const savedData = JSON.parse(localStorage.getItem("gestaoActivaData"));
      const nome = savedData?.dadosCliente?.nome;
      if (nome) {
        setUserName(nome);
        console.log("✅ Usuário ativo (LocalStorage):", nome);
      }
    };

    carregarNome();
  }, [dadosCliente]);

  // 🔹 Efeito de scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Navegação
  const irParaChat = () => navigate("/chatbot");
  const irParaLogin = () => navigate("/sign");
  const irParaDashboard = () => navigate("/dashboard");
  const irParaProdutos = () => navigate("/produtos");

  // =======================
  // 🔹 JSX
  // =======================
  return (
    <div className="landing">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="brand">
          <h1>
            Gestão <span>Ativa</span>
          </h1>
        </div>

        <nav className="nav">
          {userName ? (
            <>
              <button className="btn-nav" onClick={irParaDashboard}>
                Dashboard
              </button>
              <button className="btn-nav" onClick={irParaProdutos}>
                Produtos
              </button>
            </>
          ) : (
            <button className="btn-nav" onClick={irParaLogin}>
              Entrar
            </button>
          )}
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          {loadingCliente ? (
            <h2>Carregando...</h2>
          ) : userName ? (
            <>
              <h2>
                Bom dia, <span>{userName}</span> 👋
              </h2>
              <p>
                Continue a gerir suas finanças, acompanhe seus produtos e veja
                seus resultados em tempo real.
              </p>
              <div className="hero-buttons">
                <button className="btn-primary" onClick={irParaDashboard}>
                  <i className="fi fi-sr-chart-pie-alt"></i> Ir para Dashboard
                </button>
                <button className="btn-secondary" onClick={irParaProdutos}>
                  <i className="fi fi-sr-box"></i> Ir para Produtos
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
                <button onClick={irParaLogin}>Começar agora</button>
                <button onClick={irParaDashboard}>
                  <i className="fi fi-sr-chart-pie-alt"></i> Dashboard
                </button>
                <button onClick={irParaProdutos}>
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
