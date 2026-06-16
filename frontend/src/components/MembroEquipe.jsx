import 'bootstrap/dist/css/bootstrap.min.css';
import NavUser from './NavUser';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API_URL from "../constants/global.js";
import "../styles/membro_equip.css"
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

function RenderFormset() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state;
  // Redireciona se não houver objeto
  useEffect(() => {
    if (!state) {
      toast.error('ID da pesquisa não encontrado.');
      navigate('/minhas_solic');
    }
  }, [state, navigate]);

  const oriChoices = [
    { value: '', label: 'Selecione' },
    { value: 'mulher_trans', label: 'Mulher Trans' },
    { value: 'homem_trans', label: 'Homem Trans' },
    { value: 'mulher_cis', label: 'Mulher Cis' },
    { value: 'homem_cis', label: 'Homem Cis' },
    { value: 'outros', label: 'Outros' }
  ];

  const [formsets, setFormsets] = useState([
    {
      id: Date.now(),
      nome: '',
      rg: '',
      cpf: '',
      ori_sexual: '',
      instituicao: '',
      email: '',
      documentos: []
    }
  ]);

  // Agora errors é um array, cada posição corresponde ao membro
  const [errors, setErrors] = useState([]);

  const handleInputChange = (id, field, value) => {
    const updateFormsets = formsets.map((form) => {
      if (form.id === id) {
        return { ...form, [field]: value };
      }
      return form;
    });
    setFormsets(updateFormsets);

    // Limpar erro do campo se existir
    const idx = formsets.findIndex(f => f.id === id);
    if (errors[idx] && errors[idx][field]) {
      const newErrors = [...errors];
      newErrors[idx] = { ...newErrors[idx], [field]: undefined };
      setErrors(newErrors);
    }
  };

  const handleDocumentosChange = (id, files) => {
    const updateFormsets = formsets.map((form) => {
      if (form.id === id) {
        return { ...form, documentos: Array.from(files || []) };
      }
      return form;
    });
    setFormsets(updateFormsets);
  };

  const enviarDados = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      alert("⚠️ Você precisa estar logado");
      return;
    }

    const formData = new FormData();
    const membrosParaEnviar = formsets.map(({ id, documentos, ...rest }) => rest);

    formData.append('formsets', JSON.stringify(membrosParaEnviar));
    formData.append('id_pesquisa', state.id);

    formsets.forEach((form, index) => {
      (form.documentos || []).forEach((file) => {
        formData.append(`membro_${index}`, file);
      });
    });

    try {
      const response = await fetch(`${API_URL}/api/membros_solic_pesq/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // Resetar formulário após sucesso
        setFormsets([{
          id: Date.now(),
          nome: '',
          rg: '',
          cpf: '',
          ori_sexual: '',
          instituicao: '',
          email: '',
          documentos: []
        }]);
        setErrors([]);
        Swal.fire({
          title: data,
          icon: "success",
          position: "top-center",
          confirmButtonText: "OK"
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/info_pesquisa', { state: state });
          }
        });
      } else {
        let messageToShow = "Erro:";
        if (data.detail) {
          messageToShow = data.detail;
        }
        toast.error(data.detail);
        // Se for array, cada posição é o erro do membro
        if (Array.isArray(data)) {
          setErrors(data);
        } else {
          setErrors([data]);
        }
        return;
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("⚠️ Erro de conexão com o servidor.");
    }
  };

  const createFormset = () => {
    const novoForm = {
      id: Date.now(),
      nome: '',
      rg: '',
      cpf: '',
      ori_sexual: '',
      instituicao: '',
      email: '',
      documentos: []
    };
    setFormsets([...formsets, novoForm]);
  };

  const removeFormset = (id) => {
    if (formsets.length > 1) {
      setFormsets(formsets.filter((form) => form.id !== id));
    } else {
      alert("⚠️ Você precisa manter pelo menos um membro");
    }
  };

  return (
    <>
      <NavUser />
      <ToastContainer />
      <div className='membro-equipe-wrapper'>
        <div className='membro-equipe-container'>
          {/* Header */}
          <div className='membro-equipe-header'>
            <h1 className='membro-equipe-title'>Membros da Equipe</h1>
            <p className='membro-equipe-subtitle'>Adicione os dados dos membros que participarão desta pesquisa</p>
          </div>

          {/* Formulários */}
          {formsets.map((form, index) => (
            <div key={form.id} className='membro-card'>
              <div className='membro-card-header'>
                <h3 className='membro-card-title'>Membro da Equipe</h3>
                <span className='membro-card-badge'>#{index + 1}</span>
              </div>

              {/* Grupo 1: Nome, CPF, RG */}
              <div className='membro-field-group'>
                <div className='membro-field'>
                  <label className='membro-label required'>Nome Completo</label>
                  <input
                    type='text'
                    className='membro-input'
                    placeholder='Digite o nome completo'
                    value={form.nome}
                    maxLength={80}
                    onChange={(e) => handleInputChange(form.id, 'nome', e.target.value)}
                  />
                  {errors[index] && errors[index].nome && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].nome) ? errors[index].nome.join(' ') : errors[index].nome}</span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>CPF</label>
                  <input
                    type="text"
                    className='membro-input'
                    placeholder='Inserir sem pontuação!'
                    value={form.cpf}
                    maxLength={11}
                    onChange={(e) => handleInputChange(form.id, 'cpf', e.target.value)}
                  />
                  {errors[index] && errors[index].cpf && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].cpf) ? errors[index].cpf.join(' ') : errors[index].cpf}</span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>RG</label>
                  <input
                    type="text"
                    className='membro-input'
                    placeholder='Digite o RG'
                    value={form.rg}
                    onChange={(e) => handleInputChange(form.id, 'rg', e.target.value)}
                    maxLength={11}
                  />
                  {errors[index] && errors[index].rg && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].rg) ? errors[index].rg.join(' ') : errors[index].rg}</span>
                  )}
                </div>
              </div>

              {/* Grupo 2: Orientação Sexual, Instituição, Email */}
              <div className='membro-field-group'>
                <div className='membro-field'>
                  <label className='membro-label required'>Orientação Sexual</label>
                  <select
                    className='membro-select'
                    value={form.ori_sexual}
                    maxLength={12}
                    onChange={(e) => handleInputChange(form.id, 'ori_sexual', e.target.value)}
                  >
                    {oriChoices.map((ori) => (
                      <option key={ori.value} value={ori.value}>
                        {ori.label}
                      </option>
                    ))}
                  </select>
                  {errors[index] && errors[index].ori_sexual && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].ori_sexual) ? errors[index].ori_sexual.join(' ') : errors[index].ori_sexual}</span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>Instituição</label>
                  <input
                    type="text"
                    className='membro-input'
                    placeholder='Ex: Universidade Federal'
                    value={form.instituicao}
                    onChange={(e) => handleInputChange(form.id, 'instituicao', e.target.value)}
                    maxLength={80}
                  />
                  {errors[index] && errors[index].instituicao && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].instituicao) ? errors[index].instituicao.join(' ') : errors[index].instituicao}</span>
                  )}
                </div>

                <div className='membro-field'>
                  <label className='membro-label required'>Email</label>
                  <input
                    type="email"
                    className='membro-input'
                    placeholder='nome@email.com'
                    value={form.email}
                    onChange={(e) => handleInputChange(form.id, 'email', e.target.value)}
                    maxLength={80}
                  />
                  {errors[index] && errors[index].email && (
                    <span className='membro-error-message'>{Array.isArray(errors[index].email) ? errors[index].email.join(' ') : errors[index].email}</span>
                  )}
                </div>
              </div>

              <div className='membro-field-group'>
                <div className='membro-field' style={{ gridColumn: '1 / -1' }}>
                  <label className='membro-label'>Documentos do membro</label>
                  <input
                    type='file'
                    className='membro-input'
                    multiple
                    onChange={(e) => handleDocumentosChange(form.id, e.target.files)}
                  />
                  {form.documentos && form.documentos.length > 0 && (
                    <small className='membro-error-message' style={{ color: '#0d6efd', marginTop: '0.35rem', display: 'block' }}>
                      Arquivos selecionados: {form.documentos.map((file) => file.name).join(', ')}
                    </small>
                  )}
                </div>
              </div>

              {/* Botão de Remover (se houver mais de um formulário) */}
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

          {/* Ações */}
          <div className="membro-actions">
            <button
              type='button'
              onClick={createFormset}
              className="membro-btn membro-btn-add"
            >
              Adicionar Membro
            </button>
            <button
              type='button'
              onClick={enviarDados}
              className='membro-btn membro-btn-submit'
            >
              ✓ Enviar Formulário
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RenderFormset;