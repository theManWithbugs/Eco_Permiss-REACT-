import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/login.css";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const traduzirErro = {
    // Erros do SimpleJWT (Geralmente no data.detail)
    //Apenas os erros do data.detail inclusos até o momento
    "No active account found with the given credentials": "Usuário ou senha incorretos.",
    "User is inactive": "Esta conta foi desativada.",
    "Token is invalid or expired": "Sessão expirada. Faça login novamente.",
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Preencha usuário e senha");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        let messageToShow = "Erro:";
        if (data.detail) {
          messageToShow = traduzirErro[data.detail] || data.detail;
        }
        // setError(messageToShow);
        toast.error(messageToShow)
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      navigate("/home");

    } catch (err) {
      console.error(err);
      setError("Erro ao conectar com o servidor");
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        />
      <div className="d-flex justify-content-center" style={{ marginTop: "220px" }}>
        <div className="wrapper">
          <div className="card-switch">
            <label className="switch">
              <input type="checkbox" className="toggle" />
              <span className="slider"></span>
              <span className="card-side"></span>
              <div className="flip-card__inner">
                {/* Lado do LOGIN */}
                <div className="flip-card__front">
                  <div className="title">Log in</div>
                  <form className="flip-card__form" onSubmit={handleLogin}>
                    <input
                      className="flip-card__input"
                      placeholder="Usuário"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className="flip-card__input"
                      placeholder="Senha"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="flip-card__btn" type="submit">
                      Confirmar
                    </button>
                  </form>
                  {error &&
                  <p style={{ color: "red" }} className="fw-bold">
                    ({error})
                  </p>}
                </div>

                {/* Lado do SIGN UP (Cadastro) */}
                <div className="flip-card__back">
                  <div className="title">Sign up</div>
                  <form className="flip-card__form">
                    <input className="flip-card__input" placeholder="Name" type="text" />
                    <input className="flip-card__input" placeholder="Email" type="email" />
                    <input className="flip-card__input" placeholder="Password" type="password" />
                    <button className="flip-card__btn">Cadastrar!</button>
                  </form>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;