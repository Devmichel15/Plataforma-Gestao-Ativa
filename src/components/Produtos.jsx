import { useState } from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import "../styles/produtos.css";
import { Link } from "react-router-dom";

export default function Produtos() {
  const {
    produtos,
    adicionarProduto,
    removerProduto,
    produtosPorData,
    dadosCliente,
  } = useFinanceData();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoCusto, setPrecoCusto] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  // Totais
  const totalProdutos = produtos?.length || 0;
  const valorTotal = produtos?.reduce(
    (acc, p) => acc + (p.quantidade * p.precoVenda || 0),
    0
  );

  // Produtos filtrados
  const produtosFiltrados = Object.entries(produtosPorData || {})
    .map(([data, lista]) => [
      data,
      lista.filter((p) => p.nome?.toLowerCase().includes(busca.toLowerCase())),
    ])
    .filter(([_, lista]) => lista.length > 0)
    .sort(([a], [b]) => new Date(b) - new Date(a));

  async function handleAdicionar() {
    if (!nome || !categoria || !quantidade || !precoCusto || !precoVenda) {
      alert("Preencha todos os campos antes de adicionar!");
      return;
    }

    const lucro =
      (parseFloat(precoVenda) - parseFloat(precoCusto)) * parseInt(quantidade);

    setLoading(true);
    try {
      await adicionarProduto(
        nome,
        categoria,
        quantidade,
        precoVenda,
        precoCusto,
        lucro
      );
      setNome("");
      setCategoria("");
      setQuantidade("");
      setPrecoCusto("");
      setPrecoVenda("");
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      alert("Erro ao adicionar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemover(id) {
    if (window.confirm("Deseja realmente remover este produto?")) {
      try {
        await removerProduto(id);
      } catch (err) {
        console.error("Erro ao remover produto:", err);
      }
    }
  }

  return (
    <div className="produtos-container">
      <div className="produtos-card">
        <h2>📦 Gestão de Produtos</h2>
        {dadosCliente && (
          <p className="descricao">
            Olá, <strong>{dadosCliente.nome}</strong>! Acompanhe seus produtos
            em estoque.
          </p>
        )}

        <div className="resumo-produtos">
          <div className="resumo-item">
            <p>Total de Produtos</p>
            <strong>{totalProdutos}</strong>
          </div>
          <div className="resumo-item">
            <p>Valor Total em Estoque</p>
            <strong>Kz {valorTotal.toLocaleString()}</strong>
          </div>
        </div>

        <div className="form-produtos">
          <input
            type="text"
            placeholder="Nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
          <input
            type="number"
            placeholder="Preço de Custo (Kz)"
            value={precoCusto}
            onChange={(e) => setPrecoCusto(e.target.value)}
          />
          <input
            type="number"
            placeholder="Preço de Venda (Kz)"
            value={precoVenda}
            onChange={(e) => setPrecoVenda(e.target.value)}
          />
          <button
            className="btn-add"
            onClick={handleAdicionar}
            disabled={loading}
          >
            {loading ? "Salvando..." : "+ Adicionar"}
          </button>
        </div>

        <input
          type="text"
          className="busca"
          placeholder="🔍 Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="lista-produtos">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map(([data, lista]) => (
              <div key={data} className="grupo-data">
                <h4 className="data-titulo">📅 {data}</h4>
                {lista.map((p) => (
                  <div key={p.id} className="produto-item">
                    <div className="info">
                      <strong>{p.nome}</strong>
                      <span>{p.categoria}</span>
                      <span>{p.quantidade} un.</span>
                      <span>
                        Custo: Kz {(p.precoCusto || 0).toLocaleString()}
                      </span>
                      <span>
                        Venda: Kz {(p.precoVenda || 0).toLocaleString()}
                      </span>
                      <span>Lucro: Kz {(p.lucro || 0).toLocaleString()}</span>
                    </div>
                    <button
                      className="btn-remover"
                      onClick={() => handleRemover(p.id)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="vazio">Nenhum produto encontrado.</p>
          )}
        </div>

        <Link to="/" className="btn-voltar">
          ← Voltar
        </Link>
      </div>
    </div>
  );
}
