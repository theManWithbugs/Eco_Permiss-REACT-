import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/info_pesquisa.css';

function InfoPesquisa() {
  const navigate = useNavigate();
  const location = useLocation();
  const obj = location.state;

  useEffect(() => {
    if (!obj) {
      navigate('/minhas_solic');
    }
  }, [obj, navigate]);

  if (!obj) return null;

  const ucs_ = obj.unidade_cons || [];
  // Ajustado para area_atuacao para bater com o nome usado no map abaixo
  const area_atuacao = obj.area_atuacao || [];

  return (
    <div className='container-fluid'>
      <div className='card relatorio-card'>
        <div className="relatorio-header">
          <div className="row align-items-center">
            <div className="col-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#4caf50" className="bi bi-leaf" viewBox="0 0 16 16">
                <path d="M11.78.033a.648.648 0 0 0-.154.054c-.868.31-1.435.901-2.675 2.997-.637 1.191-1.29 2.816-1.514 4.169.703 1.079 1.213 2.779 1.364 4.692.05.623.053 1.616-.032 2.205l-.422 3.12a.5.5 0 0 1-.983-.118l.414-3.076c.07-.52.071-1.429.02-2.004-.21-2.577-.923-4.287-2.056-5.305-.656.143-1.435.354-2.26.681-.779.316-1.598.799-2.213 1.402a.5.5 0 1 1-.707-.707c.652-.651 1.577-1.177 2.409-1.517.54-.218 1.111-.408 1.583-.487-.236-.81-.556-1.502-.973-2.015-.449-.552-1.036-.937-1.899-1.052a.5.5 0 0 1 .068-.993c1.104.126 1.928.619 2.513 1.304.31.381.555.852.738 1.41.326-.08.656-.17.984-.265 1.22-.368 2.287-.82 2.937-1.562.65-.743.886-1.667.886-2.867 0-.309-.038-.619-.11-.916a.5.5 0 1 1 .976-.191c.088.447.132.816.132 1.107 0 1.34-.273 2.401-1.078 3.287-.803.884-2.053 1.463-3.428 1.884.045.56.104 1.092.126 1.38.019.248.015.628-.057 1.183l-.422 3.12a.5.5 0 0 1-.983-.118l.414-3.076z"/>
              </svg>
            </div>
            <div className="col">
              <h2>Relatório de Pesquisa</h2>
              <p className="fs-5">Informações Detalhadas</p>
            </div>
          </div>
        </div>

        <div className="card-body p-5">
          <div className='secao'>
            <h5>
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
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-clipboard-check me-2" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
              </svg>
              Documentação e Autorização
              </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-card info-card-orange">
                  <label>Fotografias da UC</label>
                  <p>{ obj.foto }</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card info-card-orange">
                  <label>Licença da Instituição</label>
                  <p>{ obj.licenca_inst }</p>
                </div>
              </div>
            </div>
          </div>
            <hr />
          <div className='secao'>
            <h5>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-flower1 me-2" viewBox="0 0 16 16">
                <path d="M6.174 1.184a.5.5 0 0 1 .652.78L6.1 2.393a3 3 0 1 1 4.788 3.894L9.5 6.393v1.214a3 3 0 1 1-3.894 4.788l-.68-.734a.5.5 0 1 1 .78-.652l.68.734a2 2 0 1 0 2.612-2.612l-1.06-1.06a2 2 0 1 0-3.894 0l1.06 1.06a2 2 0 1 0 2.612 2.612l.68-.734a.5.5 0 1 1 .78.652l-.68.734a3 3 0 1 1-4.788-3.894l1.214-.536H6.5a3 3 0 1 1-3.894-4.788l.734.68a.5.5 0 1 1-.652-.78l-.734-.68A3 3 0 1 1 6.174 1.184Z"/>
              </svg>
              Escopo e Impacto
            </h5>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-card info-card-blue">
                  <label>Retorno para a Comunidade</label>
                  <p>{ obj.retorno_comuni }</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-card info-card-teal">
                  <label>Área de Atuação</label>
                  {/* Agora a variável area_atuacao está definida corretamente */}
                  {area_atuacao.map((area, index) => (
                    <div key={index}>{area}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPesquisa;
