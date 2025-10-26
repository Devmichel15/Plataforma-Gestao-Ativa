import { useNavigate } from "react-router-dom";
import "../styles/Sign.css";
import { useState, useEffect } from "react";
import { useFinanceData } from "../hooks/useFinanceData";

function Sign() {
  const navigate = useNavigate();
  const { dadosCliente, atualizarDadosCliente, setDadosCliente, isPago } =
    useFinanceData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (dadosCliente) {
      setName(dadosCliente.nome || "");
      setEmail(dadosCliente.email || "");
    }
  }, [dadosCliente]);

  async function RegisterUser(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoCliente = { nome: name, email };

    try {
      await atualizarDadosCliente(novoCliente);
      setDadosCliente(novoCliente);
      alert("Registo bem-sucedido!");
      navigate("/checkout"); // vai direto pra ativar
    } catch (err) {
      console.error("Erro ao registrar:", err);
      alert("Erro ao registrar. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.clear();
    setDadosCliente(null);
    alert("Sessão encerrada.");
    navigate("/sign");
  }

  // se já tiver pago, vai pro app
  useEffect(() => {
    if (isPago && dadosCliente) navigate("/");
  }, [isPago, dadosCliente, navigate]);

  return (
    <div className="login">
      <form className="container" onSubmit={RegisterUser}>
        {dadosCliente ? (
          <div className="infosUser">
            <h2>Usuário Registado</h2>
            <p>
              <b>Nome:</b> {dadosCliente.nome}
            </p>
            <p>
              <b>Email:</b> {dadosCliente.email}
            </p>

            <div className="btns">
              {!isPago && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate("/checkout")}
                >
                  Ativar Acesso Premium
                </button>
              )}
              <button
                type="button"
                className="btn-secondary"
                onClick={handleLogout}
              >
                Terminar Sessão
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>Registo</h2>
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Registar
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Sign;
