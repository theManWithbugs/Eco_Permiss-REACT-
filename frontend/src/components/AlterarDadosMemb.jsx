import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from '../constants/global';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import NavUser from './NavUser';

const CAMPOS_TEXTO = [
  { key: 'nome',       label: 'Nome' },
  { key: 'rg',         label: 'RG' },
  { key: 'cpf',        label: 'CPF' },
  { key: 'email',      label: 'E-mail' },
  { key: 'instituicao', label: 'Instituição' },
];

const CAMPOS_ANEXO = [
  { key: 'doc_ident',     label: 'Identidade',            obrigatorio: true },
  { key: 'doc_cpf',       label: 'CPF',                   obrigatorio: true },
  { key: 'doc_seg_vida',  label: 'Seguro de Vida',        obrigatorio: true },
  { key: 'doc_cart_vacin',label: 'Carteira de Vacinação', obrigatorio: false },
  { key: 'licenca',       label: 'Licença',               obrigatorio: false },
  { key: 'outros',        label: 'Outros',                obrigatorio: false },
];

const mediaUrl = (path) =>
  path && (path.startsWith('http') ? path : `${API_URL}${path}`);

function AlteDadosMembro() {
  const navigate  = useNavigate();
  const { state } = useLocation();

  const { id_pesq, id_membro } = state || {};

  const [form, setForm]     = useState({ nome: '', rg: '', cpf: '', email: '', instituicao: '' });
  const [anexos, setAnexos] = useState({});   // { doc_ident: '/media/...', ... }
  const [novosArqs, setNovosArqs] = useState({}); // { doc_ident: File, ... }
  const [loading, setLoading]     = useState(false);
  const [salvando, setSalvando]   = useState(false);

  // ── Busca dados atuais ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id_pesq || !id_membro) {
      toast.error('Dados do membro não encontrados.');
      return;
    }

    const token = localStorage.getItem('access');
    if (!token) { navigate('/login'); return; }

    setLoading(true);

    fetch(`${API_URL}/api/alt_dados_memb/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_pesq, id_membro }),
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setForm({
          nome:       data.nome       || '',
          rg:         data.rg         || '',
          cpf:        data.cpf        || '',
          email:      data.email      || '',
          instituicao: data.instituicao || '',
        });
        setAnexos(data.anexo || {});
      })
      .catch(() => toast.error('Erro ao buscar dados do membro.'))
      .finally(() => setLoading(false));
  }, [id_pesq, id_membro, navigate]);

  // ── Handlers ────────────────────────────────────────────────────────────
  function handleTexto(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleArquivo(e) {
    const { name, files } = e.target;
    if (files[0]) {
      setNovosArqs(prev => ({ ...prev, [name]: files[0] }));
    }
  }

  function removerNovoArq(key) {
    setNovosArqs(prev => {
      const copia = { ...prev };
      delete copia[key];
      return copia;
    });
  }

  async function handleSalvar() {
    const token = localStorage.getItem('access');
    if (!token) { navigate('/login'); return; }

    setSalvando(true);

    const formData = new FormData();
    formData.append('id_pesq',   id_pesq);
    formData.append('id_membro', id_membro);

    // Campos de texto
    for (const [key, val] of Object.entries(form)) {
      formData.append(key, val);
    }

    // Arquivos novos
    for (const [key, file] of Object.entries(novosArqs)) {
      formData.append(key, file);
    }

    try {
      const res = await fetch(`${API_URL}/api/alt_dados_memb/`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erro ao salvar.');
        return;
      }

      toast.success('Dados atualizados com sucesso!');
      setNovosArqs({});

      // Recarrega os anexos atualizados
      const res2 = await fetch(`${API_URL}/api/alt_dados_memb/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_pesq, id_membro }),
      });
      if (res2.ok) {
        const d2 = await res2.json();
        setAnexos(d2.anexo || {});
      }

    } catch (e) {
      toast.error(`Erro na requisição: ${e.message}`);
    } finally {
      setSalvando(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  // if (loading) return <p className="p-4">Carregando...</p>;

  return (
    <>
      <NavUser />
      <ToastContainer />
      <div className="container py-4 bg-white rounded">
        {/* Campos de texto */}
        <div className="card mb-4">
          <div className="card-header fw-semibold">Dados Pessoais</div>
          <div className="card-body">
            {CAMPOS_TEXTO.map(({ key, label }) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="form-control"
                  name={key}
                  value={form[key]}
                  onChange={handleTexto}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Documentos */}
        <div className="card mb-4">
          <div className="card-header fw-semibold">Documentos</div>
          <div className="card-body">
            {CAMPOS_ANEXO.map(({ key, label, obrigatorio }) => {
              const urlAtual  = mediaUrl(anexos[key]);
              const novoArq   = novosArqs[key];

              return (
                <div key={key} className="mb-4 border-bottom pb-3">
                  <label className="form-label fw-semibold">
                    {label}
                    {obrigatorio && <span className="text-danger ms-1">*</span>}
                  </label>

                  {/* Arquivo atual */}
                  {urlAtual && !novoArq && (
                    <div className="mb-1">
                      <a
                        href={urlAtual}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="me-2"
                      >
                        📄 Ver arquivo atual
                      </a>
                    </div>
                  )}

                  {/* Novo arquivo escolhido (antes de salvar) */}
                  {novoArq && (
                    <div className="mb-1 text-success d-flex align-items-center gap-2">
                      <span>✅ {novoArq.name}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger py-0"
                        onClick={() => removerNovoArq(key)}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    className="form-control form-control-sm"
                    name={key}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleArquivo}
                  />
                  <small className="text-muted">
                    {urlAtual ? 'Escolha um arquivo para substituir o atual.' : 'Nenhum arquivo enviado.'}
                  </small>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botões */}
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleSalvar}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
            disabled={salvando}
          >
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}

export default AlteDadosMembro;