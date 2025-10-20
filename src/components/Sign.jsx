import { useNavigate } from "react-router-dom";
import "../styles/Sign.css";
import { useState, useEffect } from "react";

function Sign() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  // 🔹 Carrega usuários salvos do localStorage ao iniciar
  useEffect(() => {
    const usersData = localStorage.getItem("users");
    if (usersData) {
      setUsers(JSON.parse(usersData));
    }
  }, []);

  function RegisterUser(e) {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "") {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const newUser = { name, email };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setTimeout(() => {
      setName("");
      setEmail("");
      alert("Registo bem-sucedido!");
      navigate("/");
    }, 500);
  }

  return (
    <div className="login">
      <form className="container" onSubmit={RegisterUser}>
        {users.length > 0 ? (
          <div className="infosUser">
            <h2>Usuário Registado</h2>
            {users.map((user, index) => (
              <div key={index}>
                <p><b>Nome:</b> {user.name}</p>
                <p><b>Email:</b> {user.email}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h2>Registo</h2>
            <input
              type="text"
              placeholder="Nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Registar
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default Sign;
