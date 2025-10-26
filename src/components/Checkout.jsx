import { useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import { useNavigate } from "react-router-dom";
import "../styles/Checkout.css";

function Checkout() {
  const { dadosCliente, ativarLicenca, isPago } = useFinanceData();
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  if (!dadosCliente) {
    return (
      <div className="checkout">
        <h2>Registe-se primeiro</h2>
        <p>Volte para a página de registo e preencha seu nome e email.</p>
      </div>
    );
  }

  if (isPago) {
    return (
      <div className="checkout">
        <h2>✅ Acesso Premium ativo</h2>
        <p>Obrigado pelo apoio, {dadosCliente.nome}!</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Ir para o Início
        </button>
      </div>
    );
  }

  const handleAtivar = () => {
    const sucesso = ativarLicenca(dadosCliente.email, token);
    if (sucesso) {
      alert("✅ Licença ativada com sucesso!");
      navigate("/"); // 🔹 redireciona para a landingpage
    } else {
      alert("❌ Token inválido. Confirme com o suporte.");
    }
  };

  return (
    <div className="checkout">
      <h2>🔒 Ativar Acesso Premium</h2>
      <p>
        Insira o token que recebeu após o pagamento. Esse token é exclusivo para
        o seu e-mail: <b>{dadosCliente.email}</b>
      </p>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Ex: GA-14f9acb8de"
      />
      <button onClick={handleAtivar} className="btn-primary">
        Ativar
      </button>
    </div>
  );
}

export default Checkout;
