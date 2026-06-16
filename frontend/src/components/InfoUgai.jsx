import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import "../styles/info_ugai.css";
import API_URL from "../constants/global.js";

function InfoUgai() {
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state;

  useEffect(() => {
    if (!obj) {
      navigate('/minhas_solic');
    }
  }, [obj, navigate]);

  if (!obj) return null;

  return (
    <div className='container-fluid'>
      <ToastContainer/>
      <div className='container_ugai'>
        {/* HEADER */}
        <div className="relatorio-header-section-ugai">
          <div className="header-content">
            <div className="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#ffff" className="bi bi-house-check-fill" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
                <path d="m8 3.293 4.712 4.712A4.5 4.5 0 0 0 8.758 15H3.5A1.5 1.5 0 0 1 2 13.5V9.293z"/>
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.707l.547.547 1.17-1.951a.5.5 0 1 1 .858.514"/>
              </svg>
            </div>
            <div className="header-text">
              <h2>Solicitação de UGAI</h2>
              <p className="fs-5">Resumo e Detalhes</p>
            </div>
          </div>
        </div>

        {/* CORPO PRINCIPAL */}
        <div className="card-body p-5">
          <div className="ugai-section mb-4">
            <h5 className="ugai-section-title">Identificação</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="ugai-card ugai-card-green">
                  <label>UGAI</label>
                  <p>{obj.ugai_nome || obj.ugai || '-'}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ugai-card ugai-card-blue">
                  <label>Instituição</label>
                  <p>{obj.instituicao}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ugai-section mb-4">
            <h5 className="ugai-section-title">Período e Pessoas</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="ugai-card ugai-card-orange">
                  <label>Data de Início</label>
                  <p>{obj.data_inicio || obj.data_solicitacao}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ugai-card ugai-card-orange">
                  <label>Data de Término</label>
                  <p>{obj.data_final}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ugai-section mb-4">
            <h5 className="ugai-section-title">Atividades e Público</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="ugai-card ugai-card-gray">
                  <label>Atividades Desenvolvidas</label>
                  <p>{obj.ativ_desenv}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ugai-card ugai-card-purple">
                  <label>Público Alvo</label>
                  <p>{obj.publico_alvo}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ugai-section mb-4">
            <h5 className="ugai-section-title">Status</h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="ugai-card ugai-card-status">
                  <label>Status da Solicitação</label>
                  <span className={`badge ${obj.status === 'APROVADO' ? 'badge-ativo' : obj.status === 'PENDENTE' ? 'badge-pendente' : obj.status === 'INDEFERIDO' ? 'badge-inativo' : 'badge-finalizado'}`}>{obj.status}</span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="ugai-card ugai-card-gray">
                  <label>Data da Solicitação</label>
                  <p>{obj.data_solicitacao}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoUgai;