import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import Dashboard from "./components/Dashboard";
import Sign from "./components/Sign";
import Produtos from "./components/Produtos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sign" element={<Sign />} />
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </Router>
  );
}

export default App;
