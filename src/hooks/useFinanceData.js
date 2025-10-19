import { useState, useEffect } from "react";

export function useFinanceData() {
  const [transacoes, setTransacoes] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [dadosCliente, setDadosCliente] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("gestaoActivaData")) || {};
    setTransacoes(saved.transacoes || []);
    setMensagens(saved.mensagens || []);
    setDadosCliente(saved.dadosCliente || null);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "gestaoActivaData",
      JSON.stringify({ transacoes, mensagens, dadosCliente })
    );
  }, [transacoes, mensagens, dadosCliente]);

  const adicionarTransacao = (tipo, valor, descricao = "Sem descrição") => {
    const nova = {
      id: Date.now(),
      tipo,
      valor: Number(valor),
      descricao,
      data: new Date().toLocaleString(),
    };

    setTransacoes((prev) => [...prev, nova]);
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text:
          tipo === "ganho"
            ? `💰 Ganho de ${valor} kz adicionado com sucesso!`
            : `📉 Gasto de ${valor} kz registrado.`,
      },
    ]);
  };

  return {
    transacoes,
    mensagens,
    setMensagens,
    adicionarTransacao,
    dadosCliente,
    setDadosCliente,
  };
}
