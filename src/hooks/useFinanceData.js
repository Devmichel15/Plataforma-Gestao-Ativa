import { useState, useEffect } from "react";
import { openDB } from "idb";

// ======================
// 🔹 CONFIGURAÇÃO DO INDEXEDDB
// ======================
const DB_NAME = "GestaoActivaDB";
const STORES = ["transacoes", "produtos", "mensagens", "dadosCliente"];

async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id", autoIncrement: true });
        }
      });
    },
  });
}

// ======================
// 🔹 FUNÇÕES GENÉRICAS DE BANCO
// ======================
async function addItem(store, item) {
  const db = await initDB();
  await db.add(store, item);
}

async function getAll(store) {
  const db = await initDB();
  return db.getAll(store);
}

async function deleteItem(store, id) {
  const db = await initDB();
  await db.delete(store, id);
}

async function clearStore(store) {
  const db = await initDB();
  await db.clear(store);
}

// ======================
// 🔹 HOOK PRINCIPAL
// ======================
export function useFinanceData() {
  const savedData = JSON.parse(localStorage.getItem("gestaoActivaData")) || {
    transacoes: [],
    produtos: [],
    mensagens: [],
    dadosCliente: null,
  };

  const [transacoes, setTransacoes] = useState(savedData.transacoes || []);
  const [produtos, setProdutos] = useState(savedData.produtos || []);
  const [mensagens, setMensagens] = useState(savedData.mensagens || []);
  const [dadosCliente, setDadosCliente] = useState(savedData.dadosCliente);
  const [loadingCliente, setLoadingCliente] = useState(true);

  // ======================
  // 🔹 CARREGAR DADOS DO INDEXEDDB
  // ======================
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dbTransacoes, dbProdutos, dbMensagens, dbDadosCliente] =
          await Promise.all([
            getAll("transacoes"),
            getAll("produtos"),
            getAll("mensagens"),
            getAll("dadosCliente"),
          ]);

        if (dbTransacoes?.length) setTransacoes(dbTransacoes.reverse());
        if (dbProdutos?.length) setProdutos(dbProdutos.reverse());
        if (dbMensagens?.length) setMensagens(dbMensagens.reverse());
        if (dbDadosCliente?.length) {
          setDadosCliente(dbDadosCliente[0]);
        } else if (savedData.dadosCliente) {
          setDadosCliente(savedData.dadosCliente);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do IndexedDB:", err);
        if (savedData.dadosCliente) setDadosCliente(savedData.dadosCliente);
      } finally {
        setLoadingCliente(false);
      }
    }

    carregarDados();
  }, []);

  // ======================
  // 🔹 SINCRONIZAÇÃO COM LOCALSTORAGE
  // ======================
  useEffect(() => {
    const data = { transacoes, produtos, mensagens, dadosCliente };
    localStorage.setItem("gestaoActivaData", JSON.stringify(data));
  }, [transacoes, produtos, mensagens, dadosCliente]);

  // ======================
  // 🔹 FUNÇÕES DE TRANSAÇÕES
  // ======================
  async function adicionarTransacao(tipo, valor, descricao) {
    const nova = {
      id: Date.now(),
      tipo,
      valor: parseFloat(valor) || 0,
      descricao,
      data: new Date().toLocaleDateString("pt-PT"),
    };
    await addItem("transacoes", nova);
    setTransacoes((prev) => [nova, ...prev]);
  }

  async function removerTransacao(id) {
    await deleteItem("transacoes", id);
    setTransacoes((prev) => prev.filter((t) => t.id !== id));
  }

  // ======================
  // 🔹 FUNÇÕES DE PRODUTOS (ATUALIZADAS COM LUCRO)
  // ======================
  async function adicionarProduto(nome, categoria, quantidade, precoVenda, precoCusto, lucro) {
    const novoProduto = {
      id: Date.now(),
      nome,
      categoria,
      quantidade: parseInt(quantidade) || 0,
      precoCusto: parseFloat(precoCusto) || 0,
      precoVenda: parseFloat(precoVenda) || 0,
      lucro: parseFloat(lucro) || 0,
      data: new Date().toLocaleDateString("pt-PT"),
    };
    await addItem("produtos", novoProduto);
    setProdutos((prev) => [novoProduto, ...prev]);
  }

  async function removerProduto(id) {
    await deleteItem("produtos", id);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  // ======================
  // 🔹 FUNÇÕES DE MENSAGENS
  // ======================
  async function adicionarMensagem(autor, texto) {
    const novaMensagem = {
      id: Date.now(),
      autor,
      texto,
      data: new Date().toLocaleString("pt-PT"),
    };
    await addItem("mensagens", novaMensagem);
    setMensagens((prev) => [novaMensagem, ...prev]);
  }

  async function limparMensagens() {
    await clearStore("mensagens");
    setMensagens([]);
  }

  // ======================
  // 🔹 DADOS DO CLIENTE
  // ======================
  async function atualizarDadosCliente(dados) {
    await clearStore("dadosCliente");
    await addItem("dadosCliente", dados);
    setDadosCliente(dados);
  }

  // ======================
  // 🔹 AGRUPAMENTO POR DATA
  // ======================
  const transacoesPorData = Array.isArray(transacoes)
    ? transacoes.reduce((acc, t) => {
        if (!acc[t.data]) acc[t.data] = [];
        acc[t.data].push(t);
        return acc;
      }, {})
    : {};

  const produtosPorData = Array.isArray(produtos)
    ? produtos.reduce((acc, p) => {
        if (!acc[p.data]) acc[p.data] = [];
        acc[p.data].push(p);
        return acc;
      }, {})
    : {};

  // ======================
  // 🔹 RETORNO
  // ======================
  return {
    loadingCliente,
    transacoes,
    produtos,
    mensagens,
    dadosCliente,
    setTransacoes,
    setProdutos,
    setMensagens,
    setDadosCliente,
    adicionarTransacao,
    removerTransacao,
    adicionarProduto,
    removerProduto,
    adicionarMensagem,
    limparMensagens,
    atualizarDadosCliente,
    transacoesPorData,
    produtosPorData,
  };
}
