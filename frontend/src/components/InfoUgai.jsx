import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import "../styles/info_ugai.css";
import API_URL from "../constants/global.js";

function StatusBadge({ status }) {
  const map = {
    APROVADO:   { cls: 'iu-badge iu-badge--green',  icon: 'M9 12l2 2 4-4' },
    PENDENTE:   { cls: 'iu-badge iu-badge--amber',  icon: 'M12 8v4l3 3' },
    INDEFERIDO: { cls: 'iu-badge iu-badge--red',    icon: 'M6 18L18 6M6 6l12 12' },
  };
  const s = map[status] || { cls: 'iu-badge iu-badge--gray', icon: 'M5 13l4 4L19 7' };
  return (
    <span className={s.cls}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={s.icon}/>
      </svg>
      {status}
    </span>
  );
}

function Field({ label, value, span }) {
  return (
    <div className={`iu-field${span ? ' iu-field--span' : ''}`}>
      <span className="iu-field__label">{label}</span>
      <span className="iu-field__value">{value || '—'}</span>
    </div>
  );
}

function InfoUgai() {
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state;

  useEffect(() => {
    if (!obj) navigate('/minhas_solic');
  }, [obj, navigate]);

  if (!obj) return null;

  return (
    <div className="iu-page">
      <ToastContainer />
      <div className="iu-card">

        {/* HEADER */}
        <div className="iu-header">
          <div className="iu-header__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
              <path d="m8 3.293 4.712 4.712A4.5 4.5 0 0 0 8.758 15H3.5A1.5 1.5 0 0 1 2 13.5V9.293z"/>
              <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.707l.547.547 1.17-1.951a.5.5 0 1 1 .858.514"/>
            </svg>
          </div>
          <div>
            <h2 className="iu-header__title">Solicitação de UGAI</h2>
            <p className="iu-header__sub">Resumo e Detalhes</p>
          </div>
        </div>

        {/* BODY */}
        <div className="iu-body">

          <section className="iu-section">
            <h3 className="iu-section__title">Identificação</h3>
            <div className="iu-grid">
              <Field label="UGAI" value={obj.ugai_nome || obj.ugai} />
              <Field label="Instituição" value={obj.instituicao} />
            </div>
          </section>

          <section className="iu-section">
            <h3 className="iu-section__title">Período</h3>
            <div className="iu-grid">
              <Field label="Data de Início" value={obj.data_inicio || obj.data_solicitacao} />
              <Field label="Data de Término" value={obj.data_final} />
            </div>
          </section>

          <section className="iu-section">
            <h3 className="iu-section__title">Atividades e Público</h3>
            <div className="iu-grid">
              <Field label="Atividades Desenvolvidas" value={obj.ativ_desenv} span />
              <Field label="Público Alvo" value={obj.publico_alvo} />
            </div>
          </section>

          <section className="iu-section">
            <h3 className="iu-section__title">Status</h3>
            <div className="iu-grid">
              <div className="iu-field">
                <span className="iu-field__label">Status da Solicitação</span>
                <StatusBadge status={obj.status} />
              </div>
              <Field label="Data da Solicitação" value={obj.data_solicitacao} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default InfoUgai;