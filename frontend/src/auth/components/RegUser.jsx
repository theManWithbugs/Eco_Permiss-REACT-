import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { ContainerLogin, HeadLogin, FormStyled } from "../../styles/form_login.js";
import EcoPermissIcone from "../imgs/eoc_pers_icone_sfundo.png";
import API_URL from '../../constants/global';
import styled from 'styled-components';

const ContainerRegUser = styled.div`
  height: 700px;
  overflow-y: auto;

  max-width: 600px;
  background: #f8f9fd;
  background: linear-gradient(
    0deg,
    rgb(255, 255, 255) 0%,
    rgb(244, 247, 251) 100%
  );
  border-radius: 40px;
  padding: 25px 35px;
  border: 5px solid rgb(255, 255, 255);
  box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 30px 30px -20px;
  margin: 20px;
`;

function RegUser() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // const [username, setUsername] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassw] = useState("");

  const [sexo, setSexo] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [bairro, setBairro] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [rg, setRg] = useState("");
  const [orgaoEmiss, setOrgaoEmiss] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneFixo, setTelefoneFixo] = useState("");
  const [profissao, setProfissao] = useState("");

  const [oriSexual, setOriSexual] = useState("");

  // Choices vem aqui!
  const choices_ori = [
    { value: '', label: 'Selecione' },
    { value: 'HETEROSEXUAL', label: 'Heterossexual' },
    { value: 'HOMOSEXUAL', label: 'Homossexual' },
    { value: 'BISSEXUAL', label: 'Bissexual' },
    { value: 'ASSEXUAL', label: 'Assexual' },
    { value: 'PANSEXUAL', label: 'Pansexual' }
  ]

  async function handleRegUser(e) {
    e.preventDefault();
    setError("");

    if (password !== confPassword) {
      toast.warning("As senhas devem ser iguais!");
      return;
    }

    if (!oriSexual) {
      toast.warning("Selecione a orientação sexual!");
      return;
    }

    if (!numero || isNaN(Number(numero))) {
      toast.warning("Informe um número válido para o endereço!");
      return;
    }

    const dados = {
      first_name,
      last_name,
      password,
      ori_sexual: oriSexual,
      email,
      estado,
      cep,
      municipio,
      bairro,
      logradouro,
      numero,
      rg,
      org_emiss: orgaoEmiss,
      cpf,
      telefone,
      telefone_fixo: telefoneFixo,
      profissao,
    };

    try {
      const res = await fetch(`${API_URL}/api/reg_user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(dados),
      });

      const data = await res.json();

      if (!res.ok) {
        const primeiroValor = Object.values(data)[0];
        const mensagem = Array.isArray(primeiroValor) ? primeiroValor[0] : primeiroValor;
        throw new Error(mensagem || "Erro ao cadastrar usuário.");
      }

      const usernameRetornado = data.username || "";
      if (usernameRetornado) {
        navigate("/login", {
          state: {
            username: usernameRetornado,
            showRegisterSuccess: true,
          },
        });
      } else {
        navigate("/login");
      }

    } catch (err) {
      setError(err.message);
      toast.warning(err.message || "Erro ao conectar com o servidor!");
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
        <ContainerRegUser>
          <HeadLogin>
            <img
              src={EcoPermissIcone}
              alt="EcoPermiss"
              style={{ width: "135px" }}
            />
          </HeadLogin>

          <FormStyled onSubmit={handleRegUser}>
            <input
              required
              type="text"
              className="input"
              placeholder="Primeiro nome"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              required
              type="text"
              className="input"
              placeholder="Segundo nome"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              type="password"
              className="input"
              placeholder="Senha (letras e números)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              className="input"
              placeholder="Confirmar senha"
              value={confPassword}
              onChange={(e) => setConfPassw(e.target.value)}
            />

            <select
              required
              className='form-select mt-3 mb-1 text-secondary'
              value={oriSexual}
              onChange={(e) => setOriSexual(e.target.value)}
            >
              {choices_ori.map((ori) => (
                <option value={ori.value} key={ori.value}>
                  {ori.label}</option>
              ))}
            </select>

            <input
              required
              type="email"
              className="input"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              required
              type="text"
              className="input"
              placeholder="Estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <input
              type="text"
              className="input"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />

            <input
              required
              type="text"
              className="input"
              placeholder="Município"
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
            />

            <input
              required
              type="text"
              className="input"
              placeholder="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            <input
              type="text"
              className="input"
              placeholder="Logradouro"
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
            />

            <input
              required
              type="text"
              className="input"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />

            <div className='row'>
              <div className='col-md-6'>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="RG"
                  value={rg}
                  onChange={(e) => setRg(e.target.value)}
                />
              </div>
              <div className='col-md-6'>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Órgão Emissor"
                  value={orgaoEmiss}
                  onChange={(e) => setOrgaoEmiss(e.target.value)}
                />
              </div>
            </div>

            <input
              required
              type="text"
              className="input"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />

            <div className='row'>
              <div className='col-md-6'>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>

              <div className='col-md-6'>
                <input
                  type="text"
                  className="input"
                  placeholder="Telefone Fixo"
                  value={telefoneFixo}
                  onChange={(e) => setTelefoneFixo(e.target.value)}
                />
              </div>
            </div>

            <input
              required
              type="text"
              className="input"
              placeholder="Profissão"
              value={profissao}
              onChange={(e) => setProfissao(e.target.value)}
            />

            {error && (
              <div className="text-danger text-center">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-success">
              Cadastrar
            </button>
          </FormStyled>
        </ContainerRegUser>
      </div>
    </>
  );
}

export default RegUser;