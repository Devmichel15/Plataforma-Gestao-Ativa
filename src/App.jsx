import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useFinanceData } from "./hooks/useFinanceData";
import Sign from "./components/Sign";
import Checkout from "./components/Checkout";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
// ... outras importações

function App() {
  const { isPago, dadosCliente } = useFinanceData();

  // Proteção de rotas
  const Protegida = ({ element }) => {
    if (!dadosCliente) return <Navigate to="/sign" replace />;
    if (!isPago) return <Navigate to="/checkout" replace />;
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/sign" element={<Sign />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Rota protegida */}
        <Route path="/" element={<Protegida element={<LandingPage />} />} />
        <Route path="/dashboard" element={<Protegida element={<Dashboard />} />} />
        {/* Adiciona outras rotas protegidas aqui */}
      </Routes>
    </Router>
  );
}

export default App;
