import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/info_pesquisa.css';
import DocPesquisa from './DocPesquisa';
import API_URL from "../constants/global.js";
import ImgPDF from "../img/pdf_img.png";
import {
  IconFolder,
  IconClipboard,
  IconFlower,
  IconFile,
  IconPerson,
  IconEye,
  IconCalendar,
  IconPlus
} from '../components/IconesProntos';
import AlterarDocSolic from './AlterarDocSolic.jsx';
import * as S from "../styles/info_pesquisa.js";

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
    <img
      src={ImgPDF}
      alt="PDF"
      width="56"
      height="56"
      style={{ width: 56, height: 56, objectFit: 'contain' }}
    />
    <span className="ip-doc-card-name">{label}</span>
    <a href={href} target="_blank" rel="noreferrer" className="ip-doc-btn">
      <IconEye /> Visualizar
    </a>
  </div>
);

/* ─── Formatar doc_name ───────────────────────────────── */
const formatarNomeArquivo = (url) => {
  const nome = decodeURIComponent(url.split('/').pop());

  // "?" se sim
  // ":" se não

  return nome.length > 30
    ? `${nome.slice(0, 20)}...`
    : nome;
};

/* ─── Componente principal ───────────────────────────────── */
function InfoPesquisa() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const [membros, setMembros] = useState([]);
  const [obj, setObj] = useState({});

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
      if (!res.ok) {
        toast.error("Erro ao buscar membros");
        console.log(res);
        return;
      }
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
      <>
        {/* ── Body ── */}
        <S.Body>
          {/* Seção 1 — Identificação */}
          <S.Section>
            <S.SectionLabel>
              <IconFolder /> Identificação da Pesquisa
            </S.SectionLabel>
            <S.Cards>
              <S.Card
                borderColor="#4caf50"
                background="#f0f9f1"
              >
                <S.CardLabel>Ação(s) Realizada(s)</S.CardLabel>
                <S.CardValue>{obj.acao_realizada}</S.CardValue>
              </S.Card>
            </S.Cards>
          </S.Section>

          {/* Seção 2 — Documentação */}
          <S.Section>
            <S.SectionLabel>
              <IconClipboard /> Documentação e Autorização
            </S.SectionLabel>
            <S.Cards>
              <S.Card
                borderColor="#e49b3c"
                background="#f0f9f1"
              >
                <S.CardLabel>Fotografias da UC</S.CardLabel>
                <S.CardValue>{obj.foto}</S.CardValue>
              </S.Card>
            </S.Cards>
          </S.Section>

          {/* Seção 3 — Escopo */}
          <S.Section>
            <S.SectionLabel>
              <IconFlower /> Escopo e Impacto
            </S.SectionLabel>
            <S.Cards>
              <S.Card
                borderColor="#3c8de4"
                background="#f0f9f1"
              >
                <S.CardLabel>Retorno para a Comunidade</S.CardLabel>
                <S.CardValue>{obj.retorno_comuni}</S.CardValue>
              </S.Card>
            </S.Cards>
          </S.Section>

          <hr className="ip-divider" />

          {/* Seção 4 — Documentos do solicitante */}
          <S.Section>
            <S.SectionLabel>
              <IconFile /> Documentos do Solicitante
            </S.SectionLabel>
            <S.DocsGrid>
              {obj.doc_ident    && <DocCard href={obj.doc_ident}    label={formatarNomeArquivo(obj.doc_ident)} />}
              {obj.doc_cpf      && <DocCard href={obj.doc_cpf}      label={formatarNomeArquivo(obj.doc_cpf)} />}
              {obj.doc_seg_vida && <DocCard href={obj.doc_seg_vida} label={formatarNomeArquivo(obj.doc_seg_vida)} />}
            </S.DocsGrid>
          </S.Section>

          {/* Outros documentos */}
          {obj?.outros_documentos?.length > 0 && (
            <S.Section>
              <S.SectionLabel>
                <IconFile /> Outros Documentos
              </S.SectionLabel>
              <S.DocsGrid>
                {obj.outros_documentos.map((doc) => (
                  <DocCard key={doc.id} href={doc.doc_url} label={formatarNomeArquivo(doc.doc_url)} />
                ))}
              </S.DocsGrid>
            </S.Section>
          )}

          {/* Licenças de instituição */}
          {obj?.licencas?.length > 0 && (
            <S.Section>
              <S.SectionLabel>
                <IconFile /> Licenças de Instituição
              </S.SectionLabel>
              <S.DocsGrid>
                {obj.licencas.map((doc) => (
                  <DocCard key={doc.id} href={doc.doc_url} label={formatarNomeArquivo(doc.doc_url)} />
                ))}
              </S.DocsGrid>
            </S.Section>
          )}

          <AlterarDocSolic id_pesq={id} />

          {/* DocPesquisa (só quando aprovado) */}
          {obj.status === "APROVADO" && (
            <DocPesquisa id_pesquisa={id} status_obj={obj.status} />
          )}

          <hr className="ip-divider" />

          {/* Seção 5 — Status */}
          <S.StatusBar>
            <S.StatusMeta>
              <strong>Status da Solicitação</strong>
              <span>Situação atual do processo</span>
            </S.StatusMeta>

            <StatusBadge status={obj.status} />
          </S.StatusBar>

          {/* Footer */}
          <S.FooterNote>
            <IconCalendar />
            Solicitação registrada em {obj.data_solicitacao}
          </S.FooterNote>
          </S.Body>
      </>
  );
}

export default InfoPesquisa;