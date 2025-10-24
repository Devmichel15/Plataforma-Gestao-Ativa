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
  } = useFinanceData();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [preco, setPreco] = useState("");
  const [busca, setBusca] = useState("");

  // Totais
  const totalProdutos = produtos.length;
  const valorTotal = produtos.reduce(
    (acc, p) => acc + p.quantidade * p.preco,
    0
  );

  // Produtos filtrados
  const produtosFiltrados = Object.entries(produtosPorData)
    .map(([data, lista]) => [
      data,
      lista.filter((p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
      ),
    ])
    .filter(([_, lista]) => lista.length > 0)
    .sort(([a], [b]) => new Date(b) - new Date(a));

  return (
    <div className="produtos-container">
      <div className="produtos-card">
        <h2>📦 Gestão de Produtos</h2>
        <p className="descricao">Cadastre, visualize e acompanhe seus produtos em estoque.</p>

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
          <input type="text" placeholder="Nome do produto" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder="Categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
          <input type="number" placeholder="Qtd" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          <input type="number" placeholder="Preço (Kz)" value={preco} onChange={(e) => setPreco(e.target.value)} />
          <button onClick={() => {
            if (!nome || !categoria || !quantidade || !preco) return;
            adicionarProduto(nome, categoria, quantidade, preco);
            setNome(""); setCategoria(""); setQuantidade(""); setPreco("");
          }}>+ Adicionar</button>
        </div>

        <input type="text" className="busca" placeholder="🔍 Buscar produto..." value={busca} onChange={(e) => setBusca(e.target.value)} />

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
                      <span className="preco">Kz {p.preco.toLocaleString()}</span>
                    </div>
                    <button className="btn-remover" onClick={() => removerProduto(p.id)}>✖</button>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="vazio">Nenhum produto encontrado.</p>
          )}
        </div>

        <Link to="/" className="btn-voltar">← Voltar</Link>
      </div>
    </div>
  );
}
