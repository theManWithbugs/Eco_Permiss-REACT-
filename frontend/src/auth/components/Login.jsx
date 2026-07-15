import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import "../styles/login.css";
import API_URL from "../../constants/global.js";
// import "../styles/form_login.css";
import EcoPermissIcone from "../imgs/eoc_pers_icone_sfundo.png";
import { ContainerLogin, HeadLogin, FormStyled } from "../../styles/form_login.js";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

  // const [showPasswordChanged, setPasswordMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const traduzirErro = {
    // Erros do SimpleJWT (Geralmente no data.detail)
    //Apenas os erros do data.detail inclusos até o momento
    "No active account found with the given credentials": "Usuário ou senha incorretos.",
    "User is inactive": "Esta conta foi desativada.",
    "Token is invalid or expired": "Sessão expirada. Faça login novamente.",
  }

  useEffect(() => {
    if (location.state?.showRegisterSuccess) {
      const usernameFromReg = location.state.username || "";
      setRegisterUsername(usernameFromReg);
      if (usernameFromReg) {
        setUsername(usernameFromReg);
        toast.success(
          `Cadastro realizado com sucesso! Seu usuário é: ${usernameFromReg}`,
          {
            autoClose: false,
            closeOnClick: true,
          }
        );
      }

      navigate(location.pathname, { replace: true, state: null });
    }

    if (location.state?.showPasswordChanged) {
      toast.success(
        'Alteração de senhar realizada com sucesso!',
        {
          autoClose: false,
          closeOnClick: true,
        }
      );

      navigate(location.pathname, { replace: true, state: null });
    }

  }, [location, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Preencha usuário e senha");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/login/`, {
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
      toast.warning("Erro ao conectar com o servidor!");
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
        <div className="d-flex justify-content-center">
           <ContainerLogin>
            <HeadLogin>
              <img src={EcoPermissIcone} style={{ "width": "135px" }} />
            </HeadLogin>
            <FormStyled onSubmit={handleLogin}>
              {/* <label htmlFor="usuario">Usuario</label> */}
              <input
                placeholder="Usuario"
                id="usuario"
                type="text"
                className="input"
                required=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {/* <label htmlFor="password" className="mt-2">Senha</label> */}
              <input
                placeholder="Senha"
                id="password"
                type="password"
                className="input"
                required=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="forgot-password">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/reg_user");
                  }}
                >
                  Não tem cadastro?
                </a>
              </span>

              <span className="forgot-password">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/rec_credenc");
                  }}
                >
                  Esqueceu sua senha?
                </a>
              </span>

              {/* <input type="hidden" name="next" value="{{ next }}" /> */}

              {/* <input value="Entrar" type="submit" className="login-button" /> */}

              <button className="login-button" type="submit">Confirmar</button>
            </FormStyled>

            {registerUsername && (
              <div className="alert alert-success mt-3 text-center">
                Seu usuário registrado é: <strong>{registerUsername}</strong>
              </div>
            )}

            {error &&
              <p style={{ color: "red" }} className="fw-bold">
                ({error})
              </p>}
          </ContainerLogin>
        </div>
    </>
  );
}

export default Login;