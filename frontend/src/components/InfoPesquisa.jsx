import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/info_pesquisa.css';
import DocPesquisa from './DocPesquisa';
import API_URL from "../constants/global.js";
import ImgPDF from "../img/pdf_img.png";

/* ─── Ícones inline reutilizáveis ─────────────────────────── */
const IconLeaf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.78.033a.648.648 0 0 0-.154.054c-.868.31-1.435.901-2.675 2.997-.637 1.191-1.29 2.816-1.514 4.169.703 1.079 1.213 2.779 1.364 4.692.05.623.053 1.616-.032 2.205l-.422 3.12a.5.5 0 0 1-.983-.118l.414-3.076c.07-.52.071-1.429.02-2.004-.21-2.577-.923-4.287-2.056-5.305-.656.143-1.435.354-2.26.681-.779.316-1.598.799-2.213 1.402a.5.5 0 1 1-.707-.707c.652-.651 1.577-1.177 2.409-1.517.54-.218 1.111-.408 1.583-.487-.236-.81-.556-1.502-.973-2.015-.449-.552-1.036-.937-1.899-1.052a.5.5 0 0 1 .068-.993c1.104.126 1.928.619 2.513 1.304.31.381.555.852.738 1.41.326-.08.656-.17.984-.265 1.22-.368 2.287-.82 2.937-1.562.65-.743.886-1.667.886-2.867 0-.309-.038-.619-.11-.916a.5.5 0 1 1 .976-.191c.088.447.132.816.132 1.107 0 1.34-.273 2.401-1.078 3.287-.803.884-2.053 1.463-3.428 1.884.045.56.104 1.092.126 1.38z"/>
  </svg>
);

const IconFolder = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3H14a2 2 0 0 1 2 2v.5H.5a.5.5 0 0 0 0 1H16V8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3.87Z"/>
  </svg>
);

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z"/>
  </svg>
);

const IconFlower = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M6.174 1.184a.5.5 0 0 1 .652.78L6.1 2.393a3 3 0 1 1 4.788 3.894L9.5 6.393v1.214a3 3 0 1 1-3.894 4.788l-.68-.734a.5.5 0 1 1 .78-.652l.68.734a2 2 0 1 0 2.612-2.612l-1.06-1.06a2 2 0 1 0-3.894 0l1.06 1.06a2 2 0 1 0 2.612 2.612l.68-.734a.5.5 0 1 1 .78.652l-.68.734a3 3 0 1 1-4.788-3.894l1.214-.536H6.5a3 3 0 1 1-3.894-4.788l.734.68a.5.5 0 1 1-.652-.78l-.734-.68A3 3 0 1 1 6.174 1.184Z"/>
  </svg>
);

const IconFile = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2L9.5 1.5z"/>
  </svg>
);

const IconPerson = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6m5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z"/>
  </svg>
);

const IconEye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
  </svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
  </svg>
);

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
);

/* ─── Badge de status ─────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    APROVADO:   { cls: 'ip-badge-ativo',      label: 'EM ANDAMENTO' },
    PENDENTE:   { cls: 'ip-badge-pendente',   label: 'PENDENTE'     },
    INDEFERIDO: { cls: 'ip-badge-inativo',    label: 'INDEFERIDO'   },
    ENCERRADO:  { cls: 'ip-badge-finalizado', label: 'ENCERRADO'    },
  };
  const cfg = map[status];
  if (!cfg) return null;
  return <span className={`ip-badge ${cfg.cls}`}>{cfg.label}</span>;
};

/* ─── Card de documento PDF ──────────────────────────────── */
const DocCard = ({ href, label }) => (
  <div className="ip-doc-card">
    <img src={ImgPDF} alt="PDF" />
    <span className="ip-doc-card-name">{label}</span>
    <a href={href} target="_blank" rel="noreferrer" className="ip-doc-btn">
      <IconEye /> Visualizar
    </a>
  </div>
);

/* ─── Formatar doc_name ───────────────────────────────── */
const formatarNomeArquivo = (url) => {
  const nome = decodeURIComponent(url.split('/').pop());

  return nome.length > 30
    ? `${nome.slice(0, 20)}...`
    : nome;
};

/* ─── Componente principal ───────────────────────────────── */
function InfoPesquisa() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const id        = location.state?.id;

  const [membros, setMembros] = useState([]);
  const [obj,     setObj    ] = useState({});

  const payload = { id };

  const buscarMembros = async () => {
    const token = localStorage.getItem("access");
    if (!token) { navigate('/login'); return; }
    try {
      const res  = await fetch(`${API_URL}/api/membros_equip/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { toast.error("Erro ao buscar membros"); return; }
      setMembros(await res.json());
    } catch (e) {
      toast.warning(`Erro na requisição: ${e}`);
    }
  };

  const infoPesquisa = async () => {
    const token = localStorage.getItem("access");
    if (!token) { navigate('/login'); return; }
    try {
      const res  = await fetch(`${API_URL}/api/info_pesq/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { toast.error("Erro ao buscar dados"); return; }
      setObj(await res.json());
    } catch (e) {
      toast.warning(`Erro na requisição: ${e}`);
    }
  };

  useEffect(() => {
    if (!id) { navigate('/minhas_solic'); return; }
    buscarMembros();
    infoPesquisa();
  }, [id, navigate]);

  return (
    <div className="ip-root ip-page">
      <ToastContainer />

      <div className="ip-sheet">

        {/* ── Header ── */}
        <div className="ip-header">
          <div className="ip-header-inner">
            <div className="ip-header-icon"><IconLeaf /></div>
            <div>
              <h2 className="ip-header-title">Relatório de Pesquisa</h2>
              <p className="ip-header-sub">Informações detalhadas da solicitação</p>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ip-body">

          {/* Seção 1 — Identificação */}
          <div className="ip-section">
            <div className="ip-section-label">
              <IconFolder /> Identificação da Pesquisa
            </div>
            <div className="ip-cards">
              <div className="ip-card ip-green">
                <span className="ip-card-lbl">Ação(s) Realizada(s)</span>
                <p className="ip-card-val">{obj.acao_realizada}</p>
              </div>
            </div>
          </div>

          {/* Seção 2 — Documentação */}
          <div className="ip-section">
            <div className="ip-section-label">
              <IconClipboard /> Documentação e Autorização
            </div>
            <div className="ip-cards">
              <div className="ip-card ip-orange">
                <span className="ip-card-lbl">Fotografias da UC</span>
                <p className="ip-card-val">{obj.foto}</p>
              </div>
            </div>
          </div>

          {/* Seção 3 — Escopo */}
          <div className="ip-section">
            <div className="ip-section-label">
              <IconFlower /> Escopo e Impacto
            </div>
            <div className="ip-cards">
              <div className="ip-card ip-blue">
                <span className="ip-card-lbl">Retorno para a Comunidade</span>
                <p className="ip-card-val">{obj.retorno_comuni}</p>
              </div>
            </div>
          </div>

          <hr className="ip-divider" />

          {/* Seção 4 — Documentos do solicitante */}
          <div className="ip-section">
            <div className="ip-section-label">
              <IconFile /> Documentos do Solicitante
            </div>
            <div className="ip-docs-grid">
              {obj.doc_ident    && <DocCard href={obj.doc_ident}    label={formatarNomeArquivo(obj.doc_ident)} />}
              {obj.doc_cpf      && <DocCard href={obj.doc_cpf}      label={formatarNomeArquivo(obj.doc_cpf)} />}
              {obj.doc_seg_vida && <DocCard href={obj.doc_seg_vida} label={formatarNomeArquivo(obj.doc_seg_vida)} />}
            </div>
          </div>

          {/* Outros documentos */}
          {obj?.outros_documentos?.length > 0 && (
            <div className="ip-section">
              <div className="ip-section-label">
                <IconFile /> Outros Documentos
              </div>
              <div className="ip-docs-grid">
                {obj.outros_documentos.map((doc) => (
                  <DocCard key={doc.id} href={doc.doc_url} label={formatarNomeArquivo(doc.doc_url)} />
                ))}
              </div>
            </div>
          )}

          {/* Licenças de instituição */}
          {obj?.licencas?.length > 0 && (
            <div className="ip-section">
              <div className="ip-section-label">
                <IconFile /> Licenças de Instituição
              </div>
              <div className="ip-docs-grid">
                {obj.licencas.map((doc) => (
                  <DocCard key={doc.id} href={doc.doc_url} label={formatarNomeArquivo(doc.doc_url)} />
                ))}
              </div>
            </div>
          )}

          {/* DocPesquisa (só quando aprovado) */}
          {obj.status === "APROVADO" && (
            <DocPesquisa id_pesquisa={id} status_obj={obj.status} />
          )}

          <hr className="ip-divider" />

          {/* Seção 5 — Status */}
          <div className="ip-status-bar">
            <div className="ip-status-meta">
              <strong>Status da Solicitação</strong>
              <span>Situação atual do processo</span>
            </div>
            <StatusBadge status={obj.status} />
          </div>

          {/* Seção 6 — Membros */}
          <div className="ip-members-wrap">
            <div className="ip-members-header">
              <h6 className="ip-members-title">
                <IconPerson /> Membros Inclusos
              </h6>
              <button className="ip-add-btn" onClick={() => navigate('/membros_equipe', { state: obj })}>
                <IconPlus /> Adicionar Membro
              </button>
            </div>

            {membros.length > 0 ? (
              <div className="ip-members-grid">
                {membros.map((membro, index) => (
                  <div className="ip-member-card" key={index}>
                    <div className="ip-member-name">{membro.nome}</div>
                    <ul className="ip-member-list">
                      <li><strong>RG</strong>{membro.rg}</li>
                      <li><strong>CPF</strong>{membro.cpf}</li>
                      <li><strong>Email</strong>{membro.email}</li>
                      <li><strong>Instituição</strong>{membro.instituicao}</li>
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ip-empty">
                <div className="ip-empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1Zm8-7a3 3 0 1 0-6 0 3 3 0 0 0 6 0Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Zm0-2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"/>
                  </svg>
                </div>
                <div>
                  <p className="ip-empty-title">Nenhum membro cadastrado ainda.</p>
                  <p className="ip-empty-desc">Adicione membros para visualizar a equipe envolvida na pesquisa.</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="ip-footer-note">
            <IconCalendar />
            Solicitação registrada em {obj.data_solicitacao}
          </div>

        </div>{/* /ip-body */}
      </div>{/* /ip-sheet */}
    </div>
  );
}

export default InfoPesquisa;