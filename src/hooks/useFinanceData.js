import { useState, useEffect } from "react";

export function useFinanceData() {
  // Carregar dados existentes do localStorage
  const savedData = JSON.parse(localStorage.getItem("gestaoActivaData")) || {
    transacoes: [],
    mensagens: [],
    dadosCliente: null,
  };

  const [transacoes, setTransacoes] = useState(savedData.transacoes);
  const [mensagens, setMensagens] = useState(savedData.mensagens);
  const [dadosCliente, setDadosCliente] = useState(savedData.dadosCliente);

  // Salvar automaticamente sempre que algo mudar
  useEffect(() => {
    const data = { transacoes, mensagens, dadosCliente };
    localStorage.setItem("gestaoActivaData", JSON.stringify(data));
  }, [transacoes, mensagens, dadosCliente]);

  // === Função para adicionar transação ===
  const adicionarTransacao = (tipo, valor, descricao = "Sem descrição") => {
    const nova = {
      id: Date.now(),
      tipo,
      valor: Number(valor),
      descricao,
      data: new Date().toLocaleString("pt-PT"),
    };

    setTransacoes((prev) => [...prev, nova]);
    setMensagens((prev) => [
      ...prev,
      {
        from: "bot",
        text: `${
          tipo === "ganho" ? "📈 Ganho" : "📉 Gasto"
        } de ${valor} kz registrado com sucesso.`,
      },
    ]);
  };

  // === Pegar nome do usuário do localStorage (para notificações personalizadas) ===
  const nomeUsuario =
    dadosCliente?.nome ||
    JSON.parse(localStorage.getItem("gestaoActivaData"))?.dadosCliente?.nome ||
    "usuário";

  // === Análises automáticas e notificações inteligentes ===
  useEffect(() => {
    if (transacoes.length === 0) return;

    const totalGanhos = transacoes
      .filter((t) => t.tipo === "ganho")
      .reduce((acc, t) => acc + t.valor, 0);

    const totalGastos = transacoes
      .filter((t) => t.tipo === "gasto")
      .reduce((acc, t) => acc + t.valor, 0);

    const saldo = totalGanhos - totalGastos;

    if (saldo < 0) {
      setMensagens((prev) => [
        ...prev,
        {
          from: "bot",
          text: `<i class="fi fi-sr-warning"></i> Atenção, ${nomeUsuario}! Seu saldo está negativo (${saldo} kz). É hora de rever os gastos.`,
        },
      ]);
    } else if (saldo > 0 && saldo < 1000) {
      setMensagens((prev) => [
        ...prev,
        {
          from: "bot",
          text: `<i class="fi fi-sr-piggy-bank"></i> ${nomeUsuario}, seu saldo atual é ${saldo} kz. Continue economizando, você está indo bem!`,
        },
      ]);
    }
  }, [transacoes]);

  // === Lembretes automáticos por tempo ===
  useEffect(() => {
    const lastAccess = localStorage.getItem("lastAccess");
    const now = Date.now();

    // Se passou mais de 24h sem interação
    if (!lastAccess || now - lastAccess > 1000 * 60 * 60 * 24) {
      setMensagens((prev) => [
        ...prev,
        {
          from: "bot",
          text: `<i class="fi fi-sr-bell-ring"></i> Olá ${nomeUsuario}! Já faz um dia sem registrar suas finanças. Quer atualizar hoje?`,
        },
      ]);
      localStorage.setItem("lastAccess", now);
    }

    // Atualiza o "lastAccess" a cada 10 minutos
    const reminder = setInterval(() => {
      localStorage.setItem("lastAccess", Date.now());
    }, 1000 * 60 * 10);

    return () => clearInterval(reminder);
  }, [nomeUsuario]);

  return {
    transacoes,
    setTransacoes,
    mensagens,
    setMensagens,
    adicionarTransacao,
    dadosCliente,
    setDadosCliente,
  };
}
