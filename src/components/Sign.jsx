import { useNavigate } from "react-router-dom";
import "../styles/Sign.css";
import { useState, useEffect } from "react";
import { useFinanceData } from "../hooks/useFinanceData";

function Sign() {
  const navigate = useNavigate();
  const { dadosCliente, atualizarDadosCliente, setDadosCliente } =
    useFinanceData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🔹 Preenche automaticamente caso já tenha cliente salvo
  useEffect(() => {
    if (dadosCliente) {
      setName(dadosCliente.name || "");
      setEmail(dadosCliente.email || "");
    }
  }, [dadosCliente]);

  async function RegisterUser(e) {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const novoCliente = { nome: name, email };

    try {
      await atualizarDadosCliente(novoCliente);
      setDadosCliente(novoCliente);
      alert("Registo bem-sucedido!");
      navigate("/"); // volta para landing page
    } catch (err) {
      console.error("Erro ao registrar:", err);
      alert("Ocorreu um erro ao registrar. Tente novamente.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("gestaoActivaData");
    setDadosCliente(null);
    alert("Sessão encerrada.");
    navigate("/sign");
  }

  return (
    <div className="login">
      <form className="container" onSubmit={RegisterUser}>
        {dadosCliente ? (
          <div className="infosUser">
            <h2>Usuário Registado</h2>
            <p>
              <b>Nome:</b> {dadosCliente.name}
            </p>
            <p>
              <b>Email:</b> {dadosCliente.email}
            </p>

            <div className="btns">
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
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
