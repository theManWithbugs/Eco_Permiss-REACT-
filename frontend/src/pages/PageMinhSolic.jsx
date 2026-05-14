import 'bootstrap/dist/css/bootstrap.min.css';
import SolicPesquisa from '../components/SolicPesq';
import "../styles/minhas_solic.css";
import NavUser from "../components/NavUser";
import MinhasSolicPesq from "../components/MinhasSolicPesq";
import { useState } from 'react';
import MinhasSolicUgai from '../components/MinhasSolicUgai';
import "../styles/btn_secondary.css"

function MinhasSolic() {
  const [component, setComponent] = useState("pesquisa");

  function switchComponent(targetComponent) {
    setComponent(targetComponent);
  }

  return (
    <>
      <NavUser />

      <div className="link-menu-container container">
        <nav className="link-menu">
          <a
            // #Aplicando lógica diretamnete na classe
            className={`menu-btn menu-btn-pesquisa ${component === "pesquisa" ? "active" : ""}`}
            data-page="pesquisa"
            onClick={() => switchComponent("pesquisa")}>
            <span className="btn-icon">📋</span>
            <span className="btn-text">PESQUISAS</span>
            <span className="btn-indicator"></span>
          </a>

          <a
            className={`menu-btn menu-btn-ugai ${component === "ugai" ? "active" : ""}`}
            data-page="ugai"
            onClick={() => switchComponent("ugai")}
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-text">UGAI</span>
            <span className="btn-indicator"></span>
          </a>
        </nav>
      </div>

      {component === "pesquisa" && <MinhasSolicPesq />}
      {component === "ugai" && <MinhasSolicUgai />}
    </>
  );
}

export default MinhasSolic;