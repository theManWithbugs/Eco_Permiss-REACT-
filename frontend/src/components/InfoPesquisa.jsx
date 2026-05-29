import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import '../styles/info_pesquisa.css';
import DocPesquisa from './DocPesquisa';
import API_URL from "../constants/global.js";

function InfoPesquisa() {
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state;

  const [membros, setMembros] = useState([]);

  const ucs_ = obj?.unidade_cons || [];
  const area_atuacao = obj?.area_atuacao || [];

  const payload = {
    id: obj?.id
  };

  const buscarMembros = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("⚠️ Você precisa estar logado");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/membros_equip/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // throw new Error("Erro ao buscar dados");
        toast.error("Erro ao buscar dados");
      }

      const data = await response.json();
      setMembros(data);

    } catch (error) {
      toast.warning(`Houve um erro ao processar sua requisição: ${error}`);
    }
  };

  function AddMembro() {
    navigate('/membros_equipe', { state: obj.id });
  }

  useEffect(() => {
    if (!obj) {
      navigate('/minhas_solic');
    }
  }, [obj, navigate]);

  //Faz a busca novamente sempre que o valor do objeto alterar
  useEffect(() => {
    if (obj) {
      buscarMembros();
    }
  }, [obj]);

  if (!obj) return null;

  return (
    <div className='container-fluid'>
      <ToastContainer />
      <div className='container_sheet'>
        <div className="relatorio-header-section">
          <div className="header-content">
            <div className="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#4caf50" className="bi bi-leaf" viewBox="0 0 16 16">
                <path d="M11.78.033a.648.648 0 0 0-.154.054c-.868.31-1.435.901-2.675 2.997-.637 1.191-1.29 2.816-1.514 4.169.703 1.079 1.213 2.779 1.364 4.692.05.623.053 1.616-.032 2.205l-.422 3.12a.5.5 0 0 1-.983-.118l.414-3.076c.07-.52.071-1.429.02-2.004-.21-2.577-.923-4.287-2.056-5.305-.656.143-1.435.354-2.26.681-.779.316-1.598.799-2.213 1.402a.5.5 0 1 1-.707-.707c.652-.651 1.577-1.177 2.409-1.517.54-.218 1.111-.408 1.583-.487-.236-.81-.556-1.502-.973-2.015-.449-.552-1.036-.937-1.899-1.052a.5.5 0 0 1 .068-.993c1.104.126 1.928.619 2.513 1.304.31.381.555.852.738 1.41.326-.08.656-.17.984-.265 1.22-.368 2.287-.82 2.937-1.562.65-.743.886-1.667.886-2.867 0-.309-.038-.619-.11-.916a.5.5 0 1 1 .976-.191c.088.447.132.816.132 1.107 0 1.34-.273 2.401-1.078 3.287-.803.884-2.053 1.463-3.428 1.884.045.56.104 1.092.126 1.38.019.248.015.628-.057 1.183l-.422 3.12a.5.5 0 0 1-.983-.118l.414-3.076z"/>
              </svg>
            </div>
            <div className="header-text">
              <h2>Relatório de Pesquisa</h2>
              <p className="fs-5">Informações Detalhadas</p>
            </div>
          </div>
        </div>
        <div className="card-body p-5">
          <div className='secao'>
            <h5 className='mb-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-folder me-2" viewBox="0 0 16 16">
                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 0 9.828 6H14a2 2 0 0 1 2 2v.5H.5a.5.5 0 0 0 0 1H16V8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-.5zm5 1a1 1 0 0 0 0 2H2a1 1 0 0 0-1-1h4z"/>
              </svg>
              Identificação da Pesquisa
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-card info-card-green">
                  <label>Ação(s) Realizada(s)</label>
                  <p>{obj.acao_realizada}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card info-card-blue">
                  <label>Unidade(s) de Conservação</label>
                  {ucs_.map((uc, index) => (
                    <div key={index}>{uc}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            <hr />
          <div className='secao'>
            <h5 className='mb-3'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clipboard-check me-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
              </svg>
              Documentação e Autorização
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-card info-card-orange">
                  <label>Fotografias da UC</label>
                  <p>{obj.foto}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card info-card-orange">
                  <label>Licença da Instituição</label>
                  <p>{obj.licenca_inst}</p>
                </div>
              </div>
            </div>
          </div>
            <hr />
          <div className='secao'>
            <h5 className='mb-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-flower1 me-2" viewBox="0 0 16 16">
                <path d="M6.174 1.184a.5.5 0 0 1 .652.78L6.1 2.393a3 3 0 1 1 4.788 3.894L9.5 6.393v1.214a3 3 0 1 1-3.894 4.788l-.68-.734a.5.5 0 1 1 .78-.652l.68.734a2 2 0 1 0 2.612-2.612l-1.06-1.06a2 2 0 1 0-3.894 0l1.06 1.06a2 2 0 1 0 2.612 2.612l.68-.734a.5.5 0 1 1 .78.652l-.68.734a3 3 0 1 1-4.788-3.894l1.214-.536H6.5a3 3 0 1 1-3.894-4.788l.734.68a.5.5 0 1 1-.652-.78l-.734-.68A3 3 0 1 1 6.174 1.184Z"/>
              </svg>
              Escopo e Impacto
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-card info-card-blue">
                  <label>Retorno para a Comunidade</label>
                  <p>{obj.retorno_comuni}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card info-card-teal">
                  <label>Área de Atuação</label>
                  {area_atuacao.map((area, index) => (
                    <div key={index}>{area}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
            <hr />
            <DocPesquisa id_pesquisa={obj.id} status_obj={obj.status} />
          <div className="status-card mt-3">
            <div className="row align-items-center">
              <div className="col-12 col-md-4 mb-2 mb-md-0">
                <strong>Status da Solicitação:</strong>
              </div>
              <div className="col-12 col-md-8">
                {obj.status === "APROVADO" && (
                  <span className="badge badge-ativo d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-rocket-takeoff me-2" viewBox="0 0 16 16">
                      <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362s.96-1.932.362-2.531c-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532"/>
                      <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9 9 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a10 10 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093q.1.026.16.045c.184.06.279.13.351.295l.029.073a3.5 3.5 0 0 1 .157.721c.055.485.051 1.178-.159 2.065m-4.828 7.475.04-.04-.107 1.081a1.54 1.54 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a9 9 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006M5.205 5c-.625.626-.94 1.351-1.004 2.09a9 9 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a3 3 0 0 0-.045-.283 3 3 0 0 0-.3-.041Z"/>
                      <path d="M7.009 12.139a7.6 7.6 0 0 1-1.804-1.352A7.6 7.6 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z"/>
                    </svg>
                    EM-ANDAMENTO
                  </span>
                )}
                {obj.status === "PENDENTE" && (
                  <span className="badge badge-pendente d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history me-2" viewBox="0 0 16 16">
                      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                      <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                      <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    PENDENTE
                  </span>
                  )}
                {obj.status === "INDEFERIDO" && (
                  <span className="badge badge-inativo d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-clipboard-x me-2" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708"/>
                      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                    INDEFERIDO
                  </span>
                )}
                {obj.status === "ENCERRADO" && (
                  <span className="badge badge-finalizado d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-bookmark-check me-2" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                    </svg>
                    ENCERRADO
                  </span>
                )}
              </div>
            </div>
          </div>
            <hr />
            <div>
              <button onClick={() => AddMembro()}>Adicionar membros</button>
            </div>
          {membros.length > 0 && (
            <div className="membros-section">
              <div className="membros-header">
                <h6>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-badge-fill me-2" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z"/>
                  </svg>
                  MEMBROS INCLUSOS
                </h6>
              </div>
              <div className="membros-grid">
                  {membros.map((membro, index) => (
                    <div className="member-card" key={index}>
                      <div className='card-title'>{membro.nome}</div>
                      <ul className="list-group list-group-flush small">
                        <li className="list-group-item"><strong>RG:</strong> { membro.rg }</li>
                        <li className="list-group-item"><strong>CPF:</strong> { membro.cpf }</li>
                        <li className="list-group-item"><strong>Email:</strong> { membro.email }</li>
                        <li className="list-group-item"><strong>Instituição:</strong> { membro.instituicao }</li>
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div className="relatorio-footer mt-2">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check me-1 mb-1" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
              </svg>
              Relatório solicitado em { obj.data_solicitacao }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPesquisa;
