import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useFinanceData } from "./hooks/useFinanceData";
import Sign from "./components/Sign";
import Checkout from "./components/Checkout";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Produtos from "./components/Produtos";
import Chatbot from "./components/Chatbot";
// ... outras importações

function App() {
  const { isPago, dadosCliente } = useFinanceData();

  // Proteção de rotas — usada apenas para páginas internas
  const Protegida = ({ element }) => {
    if (!dadosCliente) return <Navigate to="/sign" replace />;
    if (!isPago) return <Navigate to="/checkout" replace />;
    return element;
  };

  return (
    <Router>
      <Routes>
        {/* 🔹 Página inicial aberta para todos */}
        <Route path="/" element={<LandingPage />} />

        {/* 🔹 Rotas públicas */}
        <Route path="/sign" element={<Sign />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* 🔹 Rotas protegidas (somente usuários autenticados) */}
        <Route path="/dashboard" element={<Protegida element={<Dashboard />} />} />
        <Route path="/produtos" element={<Protegida element={<Produtos />} />} />
        <Route path="/chatbot" element={<Protegida element={<Chatbot />} />} />

        {/* 🔹 Redireciona rotas inválidas para a página inicial */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
