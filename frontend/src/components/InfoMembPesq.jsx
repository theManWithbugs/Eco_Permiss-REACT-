import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from '../constants/global';
import { toast } from 'react-toastify';
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

const CAMPOS_ANEXO = [
  { key: 'doc_ident',      label: 'Identidade' },
  { key: 'doc_cpf',        label: 'CPF' },
  { key: 'doc_seg_vida',   label: 'Seguro de Vida' },
  { key: 'doc_cart_vacin', label: 'Carteira de Vacinação' },
  { key: 'licenca',        label: 'Licença' },
  { key: 'outros',         label: 'Outros' },
];

const mediaUrl = (path) =>
  path && (path.startsWith('http') ? path : `${API_URL}${path}`);

function InfoMembrosPesq() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const id         = state?.id;

  const [membros, setMembros] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) { navigate('/login'); return; }
    if (!id)    { toast.error('ID da pesquisa não encontrado.'); return; }

    fetch(`${API_URL}/api/info_memb_pesq/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(setMembros)
      .catch(() => toast.error('Erro ao buscar dados'));
  }, [id, navigate]);

  if (!membros.length) return <p>Nenhum membro encontrado.</p>;

  return (
    <div className="ip-members-grid">
      <div>
        <button
          className="ip-add-btn"
          onClick={() => navigate('/membros_equipe', { state: { id } })}
        >
          <IconPlus /> Adicionar Membro
        </button>
      </div>

      {membros.map(({ id: membroId, nome, rg, cpf, email, instituicao, anexos }) => (
        <div className="ip-member-card" key={membroId}>
          <div className="ip-member-name">{nome}</div>

          <button
            onClick={() =>
              navigate('/alt_memb_data', {
                state: {
                  id_pesq:  id,
                  id_membro: membroId,
                }
              })
            }
            className='btn btn-outline-primary'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2 me-1 mb-1" viewBox="0 0 16 16">
              <path d="M3.5 2a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5H12a.5.5 0 0 1 0-1h.5A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1H4a.5.5 0 0 1 0 1z"/>
              <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
            </svg>
            Alterar dados
          </button>

          <ul className="ip-member-list mt-2">
            <li><strong>RG</strong> {rg}</li>
            <li><strong>CPF</strong> {cpf}</li>
            <li><strong>Email</strong> {email}</li>
            <li><strong>Instituição</strong> {instituicao}</li>
          </ul>

          <hr />

          {anexos?.map(anexo => (
            <div key={anexo.id} className="ip-member-docs">
              <h6 className="mb-1">Documentos</h6>
              {CAMPOS_ANEXO.map(({ key, label }) => {
                const url = mediaUrl(anexo[key]);
                return url && (
                  <div key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ip-doc-link"
                      style={{ textDecoration: 'none' }}
                    >
                      📄 {label}
                    </a>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default InfoMembrosPesq;