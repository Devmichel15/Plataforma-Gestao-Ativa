import { useState, useEffect } from "react";

export function useFinanceData() {
  // Carregar dados do localStorage
  const savedData = JSON.parse(localStorage.getItem("gestaoActivaData")) || {
    transacoes: [],
    produtos: [],
    mensagens: [],
    dadosCliente: null,
  };

  const [transacoes, setTransacoes] = useState(savedData.transacoes);
  const [produtos, setProdutos] = useState(savedData.produtos);
  const [mensagens, setMensagens] = useState(savedData.mensagens);
  const [dadosCliente, setDadosCliente] = useState(savedData.dadosCliente);

  // Persistência automática
  useEffect(() => {
    const data = { transacoes, produtos, mensagens, dadosCliente };
    localStorage.setItem("gestaoActivaData", JSON.stringify(data));
  }, [transacoes, produtos, mensagens, dadosCliente]);

  // ======================
  // 🔹 FUNÇÕES DE TRANSAÇÕES
  // ======================
  function adicionarTransacao(tipo, valor, descricao) {
    const nova = {
      id: Date.now(),
      tipo,
      valor,
      descricao,
      data: new Date().toLocaleDateString("pt-PT"),
    };
    setTransacoes((prev) => [nova, ...prev]);
  }

  // ======================
  // 🔹 FUNÇÕES DE PRODUTOS
  // ======================
  function adicionarProduto(nome, categoria, quantidade, preco) {
    const novoProduto = {
      id: Date.now(),
      nome,
      categoria,
      quantidade: parseInt(quantidade),
      preco: parseFloat(preco),
      data: new Date().toLocaleDateString("pt-PT"),
    };
    setProdutos((prev) => [novoProduto, ...prev]);
  }

  function removerProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  // ======================
  // 🔹 AGRUPAMENTO POR DATA
  // ======================
  const transacoesPorData = transacoes.reduce((acc, t) => {
    if (!acc[t.data]) acc[t.data] = [];
    acc[t.data].push(t);
    return acc;
  }, {});

  const produtosPorData = produtos.reduce((acc, p) => {
    if (!acc[p.data]) acc[p.data] = [];
    acc[p.data].push(p);
    return acc;
  }, {});

  return {
    transacoes,
    produtos,
    mensagens,
    dadosCliente,
    setMensagens,
    setDadosCliente,
    setTransacoes,
    setProdutos,
    adicionarTransacao,
    adicionarProduto,
    removerProduto,
    transacoesPorData,
    produtosPorData,
  };
}
