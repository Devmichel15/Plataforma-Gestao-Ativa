import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useEffect, useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [userName, setUserName] = useState("");
  const { dadosCliente } = useFinanceData();

  useEffect(() => {
    if (dadosCliente?.nome) {
      setUserName(dadosCliente.nome);
    } else {
      const saved = JSON.parse(localStorage.getItem("gestaoActivaData"));
      setUserName(saved?.dadosCliente?.nome || "");
    }
  }, [dadosCliente]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const irParaLogin = () => navigate("/sign");
  const irParaDashboard = () => navigate("/dashboard");
  const irParaProdutos = () => navigate("/produtos");

  return (
    <div className="landing">
      {/* HEADER */}
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
                Painel
              </button>
              <button className="btn-nav" onClick={irParaProdutos}>
                Produtos
              </button>
            </>
          ) : (
            <button className="btn-nav" onClick={irParaLogin}>
              Entrar agora
            </button>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="hero gradient-bg">
        <div className="hero-text">
          <h2>
            Potencie o teu <span>crescimento financeiro</span> com clareza e estratégia.
          </h2>
          <p>
            A <strong>Gestão Ativa</strong> foi criada para empreendedores que desejam
            mais do que planilhas — querem <span className="highlight">controle real</span>,{" "}
            <span className="highlight">resultados consistentes</span> e{" "}
            <span className="highlight">autonomia</span> na gestão do seu negócio.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary pulse" onClick={irParaLogin}>
              Começar Agora
            </button>
            <button className="btn-outline" onClick={irParaDashboard}>
              Explorar Plataforma
            </button>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="benefits dark-section tone-section">
        <h3>Por que a Gestão Ativa é a escolha inteligente?</h3>
        <div className="benefit-cards">
          <div className="card accent-border">
            <i className="fi fi-sr-chart-pie-alt"></i>
            <h4>Clareza Total</h4>
            <p>Visualize cada movimento financeiro com dashboards dinâmicos e intuitivos.</p>
          </div>
          <div className="card accent-border">
            <i className="fi fi-sr-bolt"></i>
            <h4>Eficiência Automática</h4>
            <p>Automatize tarefas repetitivas e foque no que realmente importa: crescer.</p>
          </div>
          <div className="card accent-border">
            <i className="fi fi-sr-hand-holding-usd"></i>
            <h4>Decisões Inteligentes</h4>
            <p>Com base em dados reais e relatórios que falam a tua língua.</p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="feedback dark-section">
        <h3>Transformações reais com a Gestão Ativa</h3>
        <div className="testimonials">
          <blockquote>
            “Em poucas semanas, consegui visualizar onde o dinheiro estava sendo mal gasto
            e tomei decisões mais assertivas.”
            <span>— Cristiano César</span>
          </blockquote>
          <blockquote>
            “Sinto que finalmente tenho o controle da minha empresa. O painel da Gestão Ativa é o meu norte.”
            <span>— Suleily Manuel</span>
          </blockquote>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer dark-footer tone-footer">
        <p>
          © {new Date().getFullYear()} <span className="highlight">Gestão Ativa</span> —  
          Nunca foi tão fácil gerir
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
