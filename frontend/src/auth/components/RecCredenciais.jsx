import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { useState } from "react";
import "../../styles/minhas_solic.css";
import styled from "styled-components";
import { FormStyled } from "../../styles/form_login";
import API_URL from "../../constants/global";
import { Navigate, useNavigate } from "react-router-dom";

export const ContainerRecAcesso = styled.div`
  width: 450px;
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

export const CodConfirm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const CodeInput = styled.input`
  width: 30px;
  height: 40px;
  text-align: center;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid rgb(20, 181, 230);
  font-size: 20px;
  color: black;
  outline: none;
`;

export const FormLink = styled.a`
  display: block;
  margin-top: 5px;
  margin-left: 10px;
  font-size: 14px;
  color: #0099ff;
  text-decoration: none;
  cursor: pointer;
`;

function RecCredenciais() {
  const navigate = useNavigate();
  const [component, setComponent] = useState("inserir_email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [id, setId] = useState("");

  const handleInputCodigo = (e) => {
    const formulario = e.currentTarget.closest('form');
    if (!formulario) return;

    const inputsDoCodigo = formulario.querySelectorAll('input');
    let valorAcumulado = "";
    inputsDoCodigo.forEach((input) => {
      valorAcumulado += input.value;
    });
    setCodigo(valorAcumulado);

    // Caso o valor atual esteja definido passa para o próximo input
    const valorAtual = e.target.value;
    if (valorAtual && e.target.nextElementSibling) {
      e.target.nextElementSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/recup_credenc/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setComponent("inserir_codigo");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Não foi possível enviar o código. Tente novamente.");
    }
  };

  const handleCodigoSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/validar_codigo_recup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setComponent("inserir_senha");
      setId(data.id);
    } catch (error) {
      console.error("Erro ao validar código:", error);
      toast.error("Não foi possível validar o código.");
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/red_senha/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_user: id, new_password: newPassword })
      })

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        throw new Error(data.message || "Erro ao alterar senha");
      }

      navigate("/login", {
        state: {
          showPasswordChanged: true
        }
      })

    } catch (error) {
      console.error("Erro ao validar código:", error);
      toast.error("Não foi possível validar o código.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-center'>
        <ContainerRecAcesso>
          {component === "inserir_email" ? (
            <FormStyled onSubmit={handleSubmit}>
              <input
                required
                type="email"
                value={email}
                placeholder='Email cadastrado'
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className='btn btn-success' type='submit'>
                Enviar</button>
            </FormStyled>
          ) : component === "inserir_codigo" ? (
            <FormStyled onSubmit={handleCodigoSubmit}>
              <h5>Informe o código recebido por e-mail</h5>
                <CodConfirm>
                  <CodeInput
                    maxLength={1}
                    name="text"
                    type="text"
                    onChange={(e) => handleInputCodigo(e)}
                  />
                    <CodeInput
                      maxLength={1}
                      name="text"
                      type="text"
                      onChange={(e) => handleInputCodigo(e)}
                    />
                    <CodeInput
                      maxLength={1}
                      name="text"
                      type="text"
                      onChange={(e) => handleInputCodigo(e)}
                    />
                  <CodeInput
                    maxLength={1}
                    name="text"
                    type="text"
                    onChange={(e) => handleInputCodigo(e)}
                  />
                </CodConfirm>
              <button className='btn btn-success' type='submit'>
                Validar</button>
            </FormStyled>
          ) : component === "inserir_senha" ? (
            <FormStyled onSubmit={handleNewPassword}>
              <h5>Insira a nova senha de acesso!</h5>
              <input
                required
                type="password"
                value={newPassword}
                placeholder="Insira a nova senha"
                maxLength={80}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="btn btn-success" type="submit">
                Validar</button>
            </FormStyled>
          ) : null}
        </ContainerRecAcesso>
      </div>
    </>
  );
}

export default RecCredenciais;