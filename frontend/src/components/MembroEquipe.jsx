import 'bootstrap/dist/css/bootstrap.min.css';
import NavUser from './NavUser';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL, { showToast } from "../constants/global.js";
import "../styles/membro_equip.css"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

// Campos de documento — todos aceitam UM arquivo cada
const tiposDocumentos = [
  { key: 'doc_ident', label: 'Documento de Identidade (RG/CNH)', required: true },
  { key: 'doc_cpf', label: 'CPF', required: true  },
  { key: 'doc_seg_vida', label: 'Seguro de Vida', required: true  },
  { key: 'doc_cart_vacin', label: 'Carteira de Vacinação', required: false },
  { key: 'licenca', label: 'Licença', required: false },
  { key: 'outros', label: 'Outros', required: false },
];

const DOC_INICIAL = {
  doc_ident: null,
  doc_cpf: null,
  doc_seg_vida: null,
  doc_cart_vacin: null,
  licenca: null,
  outros: null,
};

const FORM_INICIAL = () => ({
  id: Date.now() + Math.random(),
  nome: '',
  rg: '',
  cpf: '',
  ori_sexual: '',
  instituicao: '',
  email: '',
  documentos: { ...DOC_INICIAL },
});

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const truncarNome = (nome, max = 30) => {
  if (!nome || nome.length <= max) return nome;
  const ext = nome.includes('.') ? nome.slice(nome.lastIndexOf('.')) : '';
  return nome.slice(0, max - ext.length - 1) + '…' + ext;
};

function RenderFormset() {
  const navigate = useNavigate();
  // ✅ FIX: extrair `state` corretamente do useLocation
  const { state } = useLocation();
  const id = state?.id;

  // ✅ FIX: useEffect usa `id` e `navigate` (state estava undefined antes)
  useEffect(() => {
    if (!id) {
      toast.error('ID da pesquisa não encontrado.');
      navigate('/minhas_solic');
    }
  }, [id, navigate]);

  const oriChoices = [
    { value: '',             label: 'Selecione'    },
    { value: 'mulher_trans', label: 'Mulher Trans' },
    { value: 'homem_trans',  label: 'Homem Trans'  },
    { value: 'mulher_cis',   label: 'Mulher Cis'   },
    { value: 'homem_cis',    label: 'Homem Cis'    },
    { value: 'outros',       label: 'Outros'       },
  ];

  const [formsets, setFormsets] = useState([FORM_INICIAL()]);
  const [errors, setErrors] = useState([]);

  // ── Handlers de texto/select ──────────────────────────────────────────────
  const handleInputChange = (formId, field, value) => {
    setFormsets(prev =>
      prev.map(form => form.id === formId ? { ...form, [field]: value } : form)
    );
    const idx = formsets.findIndex(f => f.id === formId);
    if (errors[idx]?.[field]) {
      const next = [...errors];
      next[idx] = { ...next[idx], [field]: undefined };
      setErrors(next);
    }
  };

  // ── Handler de arquivo (UM arquivo por campo) ─────────────────────────────
  const handleDocumentoChange = (formId, campo, event) => {
    const arquivo = event.target.files?.[0];
    event.target.value = ''; // reset input para permitir re-seleção do mesmo arquivo

    if (!arquivo) return;

    if (arquivo.size > MAX_SIZE) {
      toast.warning('O arquivo é muito grande. Tamanho máximo: 5 MB.');
      return;
    }

    setFormsets(prev =>
      prev.map(form =>
        form.id === formId
          ? { ...form, documentos: { ...form.documentos, [campo]: arquivo } }
          : form
      )
    );
  };

  // ── Remove arquivo de um campo ────────────────────────────────────────────
  const handleRemoverDocumento = (formId, campo) => {
    setFormsets(prev =>
      prev.map(form =>
        form.id === formId
          ? { ...form, documentos: { ...form.documentos, [campo]: null } }
          : form
      )
    );
  };

  // ── Adicionar / remover membros ───────────────────────────────────────────
  const createFormset = () => setFormsets(prev => [...prev, FORM_INICIAL()]);

  const removeFormset = (formId) => {
    if (formsets.length <= 1) {
      alert('⚠️ Você precisa manter pelo menos um membro');
      return;
    }
    setFormsets(prev => prev.filter(f => f.id !== formId));
  };

  // ── Envio ─────────────────────────────────────────────────────────────────
  const enviarDados = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access');
    if (!token) {
      alert('⚠️ Você precisa estar logado');
      return;
    }

    // Validação de documentos obrigatórios
    for (let i = 0; i < formsets.length; i++) {
      const faltando = tiposDocumentos
        .filter(d => d.required && !formsets[i].documentos[d.key])
        .map(d => d.label);

      if (faltando.length > 0) {
        toast.error(`Membro #${i + 1}: documentos obrigatórios faltando: ${faltando.join(', ')}.`, { autoClose: 6000 });
        return;
      }
    }

    const formData = new FormData();

    const membrosParaEnviar = formsets.map(({ id: _id, documentos, ...rest }) => rest);
    formData.append('formsets', JSON.stringify(membrosParaEnviar));
    formData.append('id_pesquisa', id);

    // Arquivos: membro_<index>_<campo>
    formsets.forEach((form, index) => {
      Object.entries(form.documentos).forEach(([campo, arquivo]) => {
        if (arquivo) {
          formData.append(`membro_${index}_${campo}`, arquivo);
        }
      });
    });

    try {
      const response = await fetch(`${API_URL}/api/membros_solic_pesq/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormsets([FORM_INICIAL()]);
        setErrors([]);
        Swal.fire({
          title: data,
          icon: 'success',
          position: 'top-center',
          confirmButtonText: 'OK',
        }).then(result => {
          if (result.isConfirmed) navigate('/info_pesquisa', { state });
        });
      } else {
        if (Array.isArray(data)) {
          setErrors(data);
        } else {
          setErrors([data]);
        }
        toast.error(data.message || 'Erro ao enviar formulário.');
      }
    } catch {
      alert('⚠️ Erro de conexão com o servidor.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <NavUser />
      <ToastContainer />
      <div className='container' style={{ maxWidth: "1230px" }}>
        <div className='solic-field' style={{ marginTop: '1.5rem' }}>
          <div className='solic-upload-info'>
            <p className='solic-upload-info-title'>Orientações</p>
            <ul>
              <li>Envie arquivos em PDF.</li>
              <li><span className='text-danger fw-bold'> Documento de Identidade,
                  CPF e Seguro de Vida são obrigatórios.</span></li>
              <li>Cada campo aceita <strong>um arquivo</strong>.</li>
              <li>Tamanho máximo por arquivo: 5 MB.</li>
              <li>Use nomes de arquivo claros e objetivos.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='membro-equipe-wrapper'>
        <div className='membro-equipe-container'>

          <div className='membro-equipe-header'>
            <h1 className='membro-equipe-title'>Membros da Equipe</h1>
            <p className='membro-equipe-subtitle'>
              Adicione os dados dos membros que participarão desta pesquisa
            </p>
          </div>

          {formsets.map((form, index) => (
            <div key={form.id} className='membro-card'>
              <div className='membro-card-header'>
                <h3 className='membro-card-title'>Membro da Equipe</h3>
                <span className='membro-card-badge'>#{index + 1}</span>
              </div>

              {/* ── Dados pessoais ── */}
              <div className='membro-field-group'>
                <div className='membro-field'>
                  <label className='membro-label required'>Nome Completo</label>
                  <input
                    type='text'
                    className='membro-input'
                    placeholder='Digite o nome completo'
                    value={form.nome}
                    maxLength={80}
                    onChange={e => handleInputChange(form.id, 'nome', e.target.value)}
                  />
                  {errors[index]?.nome && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].nome) ? errors[index].nome.join(' ') : errors[index].nome}
                    </span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>CPF</label>
                  <input
                    type='text'
                    className='membro-input'
                    placeholder='Inserir sem pontuação!'
                    value={form.cpf}
                    maxLength={11}
                    onChange={e => handleInputChange(form.id, 'cpf', e.target.value)}
                  />
                  {errors[index]?.cpf && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].cpf) ? errors[index].cpf.join(' ') : errors[index].cpf}
                    </span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>RG</label>
                  <input
                    type='text'
                    className='membro-input'
                    placeholder='Digite o RG'
                    value={form.rg}
                    maxLength={20}
                    onChange={e => handleInputChange(form.id, 'rg', e.target.value)}
                  />
                  {errors[index]?.rg && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].rg) ? errors[index].rg.join(' ') : errors[index].rg}
                    </span>
                  )}
                </div>
              </div>

              <div className='membro-field-group'>
                <div className='membro-field'>
                  <label className='membro-label required'>Orientação Sexual</label>
                  <select
                    className='membro-select'
                    value={form.ori_sexual}
                    onChange={e => handleInputChange(form.id, 'ori_sexual', e.target.value)}
                  >
                    {oriChoices.map(ori => (
                      <option key={ori.value} value={ori.value}>{ori.label}</option>
                    ))}
                  </select>
                  {errors[index]?.ori_sexual && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].ori_sexual) ? errors[index].ori_sexual.join(' ') : errors[index].ori_sexual}
                    </span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>Instituição</label>
                  <input
                    type='text'
                    className='membro-input'
                    placeholder='Ex: Universidade Federal'
                    value={form.instituicao}
                    maxLength={80}
                    onChange={e => handleInputChange(form.id, 'instituicao', e.target.value)}
                  />
                  {errors[index]?.instituicao && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].instituicao) ? errors[index].instituicao.join(' ') : errors[index].instituicao}
                    </span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>Email</label>
                  <input
                    type='email'
                    className='membro-input'
                    placeholder='nome@email.com'
                    value={form.email}
                    maxLength={80}
                    onChange={e => handleInputChange(form.id, 'email', e.target.value)}
                  />
                  {errors[index]?.email && (
                    <span className='membro-error-message'>
                      {Array.isArray(errors[index].email) ? errors[index].email.join(' ') : errors[index].email}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Documentos ── */}
              <div className='solic-section'>
                <div className='solic-grid-2'>
                  {tiposDocumentos.map(({ key, label, required }) => (
                    <div className='solic-field' key={key}>
                      <label className={`solic-label${required ? ' required' : ''}`} htmlFor={`${key}_${form.id}`}>
                        {label}
                      </label>

                      <label className='solic-upload'>
                        <input
                          id={`${key}_${form.id}`}
                          type='file'
                          accept='.pdf'
                          onChange={event => handleDocumentoChange(form.id, key, event)}
                        />
                        <span className='solic-upload-box'>
                          <span className='solic-upload-icon'>📎</span>
                          <span className='solic-upload-text'>
                            {form.documentos[key]
                              ? truncarNome(form.documentos[key].name)
                              : 'Selecione o arquivo'}
                          </span>
                        </span>
                      </label>

                      {form.documentos[key] && (
                        <div className='solic-upload-list'>
                          <span className='solic-upload-item'>
                            <span title={form.documentos[key].name}>{truncarNome(form.documentos[key].name)}</span>
                            <button
                              type='button'
                              className='solic-upload-remove'
                              onClick={() => handleRemoverDocumento(form.id, key)}
                              aria-label={`Remover ${form.documentos[key].name}`}
                            >
                              ×
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {formsets.length > 1 && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type='button'
                    className='membro-btn membro-btn-remove'
                    onClick={() => removeFormset(form.id)}
                  >
                    ✕ Remover Membro
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className='membro-actions'>
            <button type='button' onClick={createFormset} className='membro-btn membro-btn-add'>
              Adicionar Membro
            </button>
            <button type='button' onClick={enviarDados} className='membro-btn membro-btn-submit'>
              ✓ Enviar
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default RenderFormset;