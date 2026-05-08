import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/nav_user.css";

import IconeEcoPerm from '../img/dashboard_icon.png';
import ImgSemaAc from "../img/img_sema_ac.png";
import ImgUser from "../img/img_user_light.png";

function NavUser() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header id="header">
      <div id="info_top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <img src={ImgSemaAc} width="140px" className="ms-3 bg-white p-1 rounded" alt="Logo SEMA" />
        </Link>
      </div>

      <nav className="links" style={{ "--items": "5" }}>

        <Link to="/minhas_solic">
          Minhas solicitações
          <svg xmlns="http://w3.org" width="22" fill="currentColor" className="bi bi-folder-fill ms-1" viewBox="0 0 16 16">
            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
          </svg>
        </Link>

        <Link to="/solic_pesquisa">
          Solicitação pesquisa
          <svg xmlns="http://w3.org" width="22" height="22" fill="currentColor" className="bi bi-file-earmark-arrow-up-fill ms-1" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z" />
          </svg>
        </Link>

        <Link to="/solic_ugai" className="mt-1">
          Solicitar UGAI
          <svg xmlns="http://w3.org" width="24" height="24" fill="currentColor" className="bi bi-house-fill mb-1" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z" />
          </svg>
        </Link>

        <Link to="/perfil">
          <img src={ImgUser} width="42px" alt="Avatar" />
          Nome do Usuário
        </Link>

        <Link to="#" onClick={e => { e.preventDefault(); handleLogout(); }} className="mt-1">
          <span>
            Sair
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-box-arrow-right ms-1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v8A1.5 1.5 0 0 0 3.5 13h6a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </span>
        </Link>

      </nav>
    </header>
  );
}

export default NavUser;
