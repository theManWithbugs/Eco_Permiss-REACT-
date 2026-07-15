import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logout } from "../auth/components/auth";
import 'bootstrap/dist/css/bootstrap.min.css';

import IconeEcoPerm from '../img/dashboard_icon.png';
import ImgSemaAc from "../img/img_sema_ac.png";
import ImgUser from "../img/img_user_light.png";

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: 'Lato', sans-serif;
`;

const InfoTop = styled.div`
  background-color: #0059B2;
  position: relative;
  padding: 5px 0 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      #009739 0%,
      #009739 15%,
      #2d89ef 45%,
      #ffcc00 75%,
      #f2c300 100%
    );
    pointer-events: none;
    z-index: 2;
  }
`;

const NavLinks = styled.nav`
  background-color: #327a50;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2),
    transparent
  );
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.2);

  display: grid;
  grid-template-columns: repeat(5, 1fr);

  font-size: 1.2rem;
  font-weight: 300;
`;

const NavItem = styled(Link)`
  color: #cfeedd;
  padding: 15px;
  text-align: center;
  text-decoration: none;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.95);
  }
`;

function NavUser() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <Header>
      <InfoTop>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <img
            src={ImgSemaAc}
            width="140"
            className="ms-3 bg-white p-1 rounded"
            alt="Logo SEMA"
          />
        </Link>
      </InfoTop>

      <NavLinks>
        <NavItem to="/minhas_solic">
          Minhas solicitações
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3" />
          </svg>
        </NavItem>

        <NavItem to="/solic_pesquisa">
          Solicitação pesquisa
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0" />
          </svg>
        </NavItem>

        <NavItem to="/solic_ugai">
          Solicitar UGAI
          <svg xmlns="http://www.w3.org/2000/svg" width="22" fill="currentColor" className="bi bi-house-fill" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
          </svg>
        </NavItem>

        <NavItem to="/perfil">
          <img src={ImgUser} width="42" alt="Avatar" />
          Nome do Usuário
        </NavItem>

        <NavItem
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Sair
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            fill="currentColor"
            className="bi bi-door-open-fill"
            viewBox="0 0 16 16">
              <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
          </svg>
        </NavItem>
      </NavLinks>
    </Header>
  );
}

export default NavUser;