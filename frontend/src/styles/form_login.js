import styled from "styled-components";

export const ContainerLogin = styled.div`
  max-width: 450px;
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

export const ContainerRecAcesso = styled.div`
  max-width: 450px;
  width: 100%;
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
  color: white;
  outline: none;
`;

export const HeadLogin = styled.div`
  text-align: center;
  font-weight: 900;
  font-size: 30px;
  color: rgb(16, 137, 211);
`;

export const FormStyled = styled.form`
  margin-top: 20px;

  /* Estilo do Input de texto */
  input {
    width: 100%;
    background: white;
    border: none;
    padding: 15px 20px;
    border-radius: 20px;
    margin-top: 15px;
    box-shadow: #cff0ff 0px 10px 10px -5px;
    border-inline: 2px solid transparent;

    &::-moz-placeholder {
      color: rgb(170, 170, 170);
    }

    &::placeholder {
      color: rgb(170, 170, 170);
    }

    &:focus {
      outline: none;
      border-inline: 2px solid #12b1d1;
    }
  }

  /* Estilo do container de "Esqueceu a senha" */
  .forgot-password {
    display: block;
    margin-top: 10px;
    margin-left: 10px;

    a {
      font-size: 11px;
      color: #0099ff;
      text-decoration: none;
    }
  }

  /* Estilo do botão de Login */
  button {
    display: block;
    width: 100%;
    font-weight: bold;
    background: linear-gradient(
      45deg,
      rgb(16, 137, 211) 0%,
      rgb(18, 177, 209) 100%
    );
    color: white;
    padding-block: 15px;
    margin: 20px auto;
    border-radius: 20px;
    box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 20px 10px -15px;
    border: none;
    transition: all 0.2s ease-in-out;
    cursor: pointer; /* Adicionado para usabilidade */

    &:hover {
      transform: scale(1.03);
      box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 23px 10px -20px;
    }

    &:active {
      transform: scale(0.95);
      box-shadow: rgba(133, 189, 215, 0.8784313725) 0px 15px 10px -10px;
    }
  }
`;
