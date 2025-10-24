import { useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const { transacoes, setTransacoes, setMensagens } = useFinanceData();
  const [tipo, setTipo] = useState("ganho");
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const navigate = useNavigate();

  // === Adicionar transação ===
  const adicionarTransacao = (tipo, valor, descricao) => {
    const dataAtual = new Date().toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const nova = {
      id: Date.now(),
      tipo,
      valor,
      descricao,
      data: dataAtual,
    };

    setTransacoes((prev) => [nova, ...prev]);
  };

  // === Remover transação ===
  const removerTransacao = (id) => {
    const atualizado = transacoes.filter((t) => t.id !== id);
    setTransacoes(atualizado);
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text: `<i class="fi fi-sr-trash"></i> Uma transação foi removida.`,
      },
    ]);
  };

  // === Totais ===
  const totalGanhos = transacoes
    .filter((t) => t.tipo === "ganho")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalGastos = transacoes
    .filter((t) => t.tipo === "gasto")
    .reduce((acc, t) => acc + t.valor, 0);

  const totalGeral = totalGanhos + totalGastos;
  const percentGanhos = totalGeral
    ? ((totalGanhos / totalGeral) * 100).toFixed(1)
    : 0;
  const percentGastos = totalGeral
    ? ((totalGastos / totalGeral) * 100).toFixed(1)
    : 0;

  // === Agrupar por data ===
  const transacoesPorData = transacoes.reduce((acc, t) => {
    if (!acc[t.data]) acc[t.data] = [];
    acc[t.data].push(t);
    return acc;
  }, {});

  // === Adicionar nova transação ===
  const handleAdd = () => {
    if (!valor) return alert("Digite um valor");
    adicionarTransacao(tipo, Number(valor), descricao || "Sem descrição");
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text: `<i class="fi fi-sr-bell"></i> Novo ${tipo} de ${valor} kz adicionado no dashboard!`,
      },
    ]);
    setValor("");
    setDescricao("");
  };

  // === Gráfico ===
  const data = {
    labels: ["Ganhos", "Gastos"],
    datasets: [
      {
        data: [totalGanhos, totalGastos],
        backgroundColor: ["#00c46a", "#ff4d4d"],
        borderColor: ["#111", "#111"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <div className="view">
        {/* === RESUMO === */}
        <div className="resumo">
          <p>
            <i className="fi fi-sr-sack-dollar"></i> Ganhos:{" "}
            <strong>{totalGanhos} kz</strong>
          </p>
          <p>
            <i className="fi fi-sr-trending-down"></i> Gastos:{" "}
            <strong>{totalGastos} kz</strong>
          </p>
          <p>
            <i className="fi fi-sr-wallet"></i> Saldo:{" "}
            <strong>{totalGanhos - totalGastos} kz</strong>
          </p>
        </div>
        {/* === FORMULÁRIO === */}
        <div className="form-add">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="ganho">Ganho</option>
            <option value="gasto">Gasto</option>
          </select>
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <button onClick={handleAdd}>
            <i className="fi fi-sr-plus-small"></i> Adicionar
          </button>
        </div>

        {/* === LISTA === */}
        <div className="lista">
          {Object.keys(transacoesPorData).length > 0 ? (
            Object.entries(transacoesPorData).map(([data, lista]) => (
              <div key={data} className="grupo-data">
                <h4>📅 {data}</h4>
                {lista.map((t) => (
                  <div key={t.id} className={`item ${t.tipo}`}>
                    <span>
                      {t.tipo === "ganho" ? (
                        <i className="fi fi-sr-arrow-trend-up"></i>
                      ) : (
                        <i className="fi fi-sr-arrow-trend-down"></i>
                      )}{" "}
                      {t.descricao}
                    </span>
                    <div className="acoes">
                      <span>{t.valor} kz</span>
                      <button
                        className="btn-remover"
                        onClick={() => removerTransacao(t.id)}
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}>
              Nenhuma transação ainda.
            </p>
          )}
        </div>

        {/* === GRÁFICO === */}
        <div className="grafico">
          <h3>Distribuição Financeira</h3>
          <Pie data={data} options={options} />
          <p>
            <span style={{ color: "#00c46a" }}>Ganhos:</span> {percentGanhos}% |{" "}
            <span style={{ color: "#ff4d4d" }}>Gastos:</span> {percentGastos}%
          </p>
        </div>

        <button className="btn-back" onClick={() => navigate("/")}>
          <i className="fi fi-sr-arrow-left"></i> Voltar
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
