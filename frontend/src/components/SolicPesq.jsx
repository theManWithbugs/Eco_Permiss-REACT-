import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buscarChoicesDoBanco from '../constants/choices';
import API_URL, { getUserData, showToast } from "../constants/global.js";
import '../styles/solic_pesq.css';
import '../styles/file_info_form.css';
import ImgPDF from "../img/pdf_img.png";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

function SolicPesquisa() {
  const navigate = useNavigate();

  //The most important!
  const token = localStorage.getItem("access");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [acao, setAcao] = useState('');
  const [foto, setFoto] = useState('');
  // const [licenca, setLicenca] = useState('');
  const [dataInic, setDataInic] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [retComun, setRetCom] = useState('');

  const [unidade, setUnidade] = useState([]);
  const [areaAtuacao, setAreaAtuacao] = useState([]);

  const [choicesUCS, setChoicesUCS] = useState([]);
  const [choicesArea, setChoicesArea] = useState([]);

  const [checkAceite, setCheckAceite] = useState(false);
  const [documentos, setDocumentos] = useState({
    doc_ident: [],
    doc_cpf: [],
    doc_seg_vida: [],
    licenca: [],
    outros: []
  });

  const tiposDocumentos = [
    { key: 'doc_ident', label: 'Documento de Identidade', multiplo: false },
    { key: 'doc_cpf', label: 'CPF', multiplo: false },
    { key: 'doc_seg_vida', label: 'Seguro de Vida', multiplo: false },
    { key: 'outros', label: 'Outros', multiplo: true }
  ];

  const IconAlert = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-diamond text-danger" viewBox="0 0 16 16">
      <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
    </svg>
  )

  // const [dadosUser, setDadosUser] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const limparDoc = (doc_name, event) => {
    // 1. Limpa o estado do React dinamicamente baseado na string enviada
    setDocumentos(prevState => ({
      ...prevState,
      [doc_name]: []
    }));

    // 2. Limpa o input HTML que disparou o evento se ele existir
    if (event && event.target) {
      event.target.value = "";
    }
  };

  const handleCheckboxChangeUnidade = (value) => {
    setUnidade((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
    console.log(unidade);
  };

  const handleCheckboxChangeArea = (value) => {
    setAreaAtuacao((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      navigate('/login');
      return;
    }

    if (checkAceite === false) {
      toast.warning("Faz se necessario o aceite dos termos!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('acao_realizada', acao);
    formData.append('unidade_cons', unidade.join(","));
    formData.append('foto', foto);
    // formData.append('licenca', licenca);
    formData.append('inicio_atividade', dataInic);
    formData.append('final_atividade', dataFim);
    formData.append('retorno_comuni', retComun);
    formData.append('area_atuacao', areaAtuacao.join(","));

    Object.entries(documentos).forEach(([campo, arquivos]) => {
      arquivos.forEach((arquivo) => {
        formData.append(campo, arquivo);
      });
    });

    try {
      const response = await fetch(`${API_URL}/api/solic_pesquisa/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/membros_equipe', { state: data });
      }

      if (!response.ok) {
        setErrors(data);
        setLoading(false);
        showToast(response.status, data.message)
        return;
      }

      // RESET
      setErrors({});
      setAcao('');
      setUnidade([]);
      setFoto('');
      // setLicenca('');
      setDataInic('');
      setDataFim('');
      setRetCom('');
      setAreaAtuacao([]);
      setDocumentos({
        doc_ident: [],
        doc_cpf: [],
        doc_seg_vida: [],
        licenca: [],
        outros: []
      });
      setLoading(false);

    } catch (error) {
      console.error("❌ ERRO:", error);
      alert("Erro ao conectar com o servidor");
      setLoading(false);
    }
  };

  const handleDocumentoChange = (campo, event) => {
    const arquivoSelecionado = event.target.files?.[0];
    const maxSizeBytes = 5 * 1024 * 1024;

    // campo = "doc_ident"

    if (arquivoSelecionado.size > maxSizeBytes) {
      toast.warning("O arquivo é muito grande o tamanho maximo é 5MB.");
      limparDoc(campo, event);
      return;
    }

    if (!arquivoSelecionado) return;

    setDocumentos((prev) => ({
      ...prev,
      [campo]: [arquivoSelecionado],
    }));
  };

  const handleDocumentoChangeMultiplo = (campo, event) => {
    // Transforma a FileList do HTML em um Array real do JS
    const arquivosSelecionados = Array.from(event.target.files || []);
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (arquivosSelecionados.length === 0) return;

    // Correção do seu IF comentado: Verifica se ALGUÉM na lista passa de 5MB
    const possuiArquivoMuitoGrande = arquivosSelecionados.some(arquivo => arquivo.size > maxSizeBytes);

    if (possuiArquivoMuitoGrande) {
      toast.warning("Um ou mais arquivos são muito grandes. O tamanho máximo permitido é 5MB por arquivo.");
      event.target.value = ''; // Limpa o input
      return;
    }

    setDocumentos((prev) => {
      const existentes = prev[campo] || [];

      // Evita duplicar arquivos com mesmo nome e tamanho já adicionados anteriormente
      const novos = arquivosSelecionados.filter((novo) =>
        !existentes.some(
          (existente) =>
            existente.name === novo.name && existente.size === novo.size
        )
      );
      return {
        ...prev,
        [campo]: [...existentes, ...novos]
      };
    });

    // Limpa o input para permitir selecionar os mesmos arquivos novamente, se necessário
    event.target.value = '';
  };

  const handleRemoverDocumento = (campo, index) => {
    setDocumentos((prev) => ({
      ...prev,
      [campo]: prev[campo].filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const carregar_unidades = async () => {
      try {
        const choices = await buscarChoicesDoBanco();

        const choicesUCS_ = choices["choices_ucs"].map(([chave, nome]) => ({
          value: chave,
          label: nome
        }));

        const choicesArea_ = choices["choices_area"].map(([chave, nome]) => ({
          value: chave,
          label: nome
        }));

        setChoicesUCS(choicesUCS_);
        setChoicesArea(choicesArea_);

      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };
    carregar_unidades();

    const carregar_dados_user = async () => {
      try {
        const userData = await getUserData(token);
        if (userData) {
          // setDadosUser(userData);
          setFirstName(userData.first_name);
          setLastName(userData.last_name);
        }
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };
    if (token) {
      carregar_dados_user();
    }
  }, []);

  return (
    <div className='solic-container'>
      <div className='solic-wrapper'>
        {/* Header */}
        <div className='solic-header'>
          <div className='solic-header-content'>
            <h1 className='solic-title'>Solicitação de Pesquisa</h1>
            <p className='solic-subtitle'>Preencha os dados da sua pesquisa científica</p>
          </div>
          <div className='solic-accent-shape'></div>
        </div>

        <div className='container p-3'>
          <h5 className='solic-section-title'>Regulamento de pesquisa</h5>
          <div className='row'>
            <div className="col-md-6">
              <div className="card document-card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <img src={ImgPDF} alt="" width="85px" />
                  </div>

                  <div className="mt-auto">
                    <a href="http://127.0.0.1:8000/media/constant_files/regulamenta_pesquisa.pdf" target="_blank" className="btn btn-sm btn-primary w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill me-1" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                      </svg>
                      Visualizar
                    </a>
                  </div>
                </div>
                <div className="form-check ms-4 mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                    checked={checkAceite}
                    onChange={e => setCheckAceite(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    Confirmo que li e concordo com os termos
                  </label>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="card document-card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">Termo de compromisso do solitante</h5>
                  {/* {dadosUser && dadosUser.length > 0 ? (
                    <div>
                      <p><strong>Nome:</strong> {dadosUser[0]?.first_name}</p>
                      <p><strong>Sobrenome:</strong> {dadosUser[0]?.last_name}</p>
                    </div>
                  ) : (
                    <p className="text-muted">Carregando dados...</p>
                  )} */}
                  <p>Eu <strong>{ firstName } { lastName }</strong>, portador do RG n°<strong></strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='solic-form'>
          <div className='solic-section'>
            <h2 className='solic-section-title'>Documentos do solicitante da pesquisa</h2>
            <div className='solic-grid-2'>
              {tiposDocumentos.slice(0, 2).map(({ key, label }) => (
                <div className='solic-field' key={key}>
                  <label className='solic-label' htmlFor={key}>{label}</label>
                  <label className='solic-upload'>
                    <input
                      id={key}
                      type='file'
                      name={key}
                      accept='.pdf'
                      onChange={(event) => handleDocumentoChange(key, event)}
                    />
                    <span className='solic-upload-box'>
                      <span className='solic-upload-icon'>📎</span>
                      <span className='solic-upload-text'>
                        {documentos[key].length > 0
                          ? `${documentos[key].length} arquivo(s) selecionado(s)`
                          : 'Selecione o arquivo'}
                      </span>
                    </span>
                  </label>
                  {documentos[key].length > 0 && (
                    <div className='solic-upload-list'>
                      {documentos[key].map((arquivo, index) => (
                        <span key={`${arquivo.name}-${index}`} className='solic-upload-item'>
                          <span>{arquivo.name}</span>
                          <span>{ key }, { index }</span>
                          <button
                            type='button'
                            className='solic-upload-remove'
                            onClick={() => handleRemoverDocumento(key, index)}
                            aria-label={`Remover ${arquivo.name}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='solic-grid-2' style={{ marginTop: '1.5rem' }}>
              {tiposDocumentos.slice(2).map(({ key, label, multiplo }) => (
                <div className='solic-field' key={key}>
                  <label className='solic-label' htmlFor={key}>{label}</label>
                  <label className='solic-upload'>
                    <input
                      id={key}
                      type='file'
                      name={key}
                      accept='.pdf'
                      multiple={multiplo}
                      onChange={(event) =>
                        multiplo
                          ? handleDocumentoChangeMultiplo(key, event)
                          : handleDocumentoChange(key, event)
                      }
                    />
                    <span className='solic-upload-box'>
                      <span className='solic-upload-icon'>📎</span>
                      <span className='solic-upload-text'>
                        {documentos[key].length > 0
                          ? `${documentos[key].length} arquivo(s) selecionado(s)`
                          : multiplo
                            ? 'Selecione um ou mais arquivos'
                            : 'Selecione o arquivo'}
                      </span>
                    </span>
                  </label>
                  {documentos[key].length > 0 && (
                    <div className='solic-upload-list'>
                      {documentos[key].map((arquivo, index) => (
                        <span key={`${arquivo.name}-${index}`} className='solic-upload-item'>
                          <span>{arquivo.name}</span>
                          <button
                            type='button'
                            className='solic-upload-remove'
                            onClick={() => handleRemoverDocumento(key, index)}
                            aria-label={`Remover ${arquivo.name}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className='solic-field' style={{ marginTop: '1.5rem' }}>
              <label className='solic-label' htmlFor='licenca'>Licença</label>
              <label className='solic-upload'>
                <input
                  id='licenca'
                  type='file'
                  name='licenca'
                  accept='.pdf'
                  multiple
                  onChange={(event) => handleDocumentoChangeMultiplo('licenca', event)}
                />
                <span className='solic-upload-box'>
                  <span className='solic-upload-icon'>📎</span>
                  <span className='solic-upload-text'>
                    {documentos.licenca.length > 0
                      ? `${documentos.licenca.length} arquivo(s) selecionado(s)`
                      : 'Selecione um ou mais arquivos'}
                  </span>
                </span>
              </label>
              {documentos.licenca.length > 0 && (
                <div className='solic-upload-list'>
                  {documentos.licenca.map((arquivo, index) => (
                    <span key={`${arquivo.name}-${index}`} className='solic-upload-item'>
                      <span>{arquivo.name}</span>
                      <button
                        type='button'
                        className='solic-upload-remove'
                        onClick={() => handleRemoverDocumento('licenca', index)}
                        aria-label={`Remover ${arquivo.name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='solic-field' style={{ marginTop: '1.5rem' }}>
              <div className='solic-upload-info'>
                <p className='solic-upload-info-title'>Orientações</p>
                <ul>
                  <li>Envie arquivos em PDF</li>
                  <li>Documento de indentidade, seguro de vida e CPF são obrigatorios!</li>
                  <li>Para Documento de Identidade, CPF e Seguro de Vida, envie um arquivo por categoria.</li>
                  <li>Para Licença e Outros, você pode enviar múltiplos arquivos.</li>
                  <li>O nome do arquivo deve ser claro e objetivo.</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Seção 1: Ação e Fotos */}
          <div className='solic-section'>
            <h2 className='solic-section-title'>Informações Básicas</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>
                  Ação realizada <IconAlert />
                </label>
                <input
                  className='solic-input'
                  placeholder='Descreva a ação principal'
                  value={acao}
                  maxLength={80}
                  onChange={(e) => setAcao(e.target.value)}
                />
                {errors.acao_realizada && (
                  <span className='solic-error'>{errors.acao_realizada}</span>
                )}
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Fotografias? <IconAlert /></label>
                <select
                  className='solic-select'
                  value={foto}
                  maxLength={3}
                  onChange={(e) => setFoto(e.target.value)}
                >
                  <option value="">Selecione uma opção</option>
                  <option value="SIM">✓ SIM</option>
                  <option value="NAO">✗ NÃO</option>
                </select>
                {errors.foto && (
                  <span className='solic-error'>{errors.foto}</span>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Área e Unidades */}
          <div className='solic-section'>
            <h2 className='solic-section-title'>Escopo</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Área de atuação <IconAlert /></label>
                <div className='solic-checkbox-group'>
                  {choicesArea.map((area) => (
                    <label key={area.value} className='solic-checkbox'>
                      <input
                        type='checkbox'
                        checked={areaAtuacao.includes(area.value)}
                        onChange={() => handleCheckboxChangeArea(area.value)}
                        className='solic-checkbox-input'
                      />
                      <span className='solic-checkbox-mark'></span>
                      <span className='solic-checkbox-label'>{area.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Unidades de Conservação <IconAlert /></label>
                <div className='solic-checkbox-group'>
                  {choicesUCS.map((uc) => (
                    <label key={uc.value} className='solic-checkbox'>
                      <input
                        type='checkbox'
                        checked={unidade.includes(uc.value)}
                        onChange={() => handleCheckboxChangeUnidade(uc.value)}
                        className='solic-checkbox-input'
                      />
                      <span className='solic-checkbox-mark'></span>
                      <span className='solic-checkbox-label'>{uc.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Documentação */}
          <div className='solic-section'>
            <h2 className='solic-section-title'>Descrição</h2>
            <div className='solic-grid-2'>
              {/* <div className='solic-field'>
                <label className='solic-label'>Número de Licença</label>
                <input
                  className='solic-input'
                  placeholder='Ex: IBAMA 2024/001'
                  value={licenca}
                  maxLength={120}
                  onChange={(e) => setLicenca(e.target.value)}
                />
              </div> */}

              <div className='solic-field'>
                <label className='solic-label'>Benefícios Gerados <IconAlert /></label>
                <input
                  className='solic-input'
                  placeholder='Descreva os retornos à comunidade'
                  value={retComun}
                  maxLength={150}
                  onChange={(e) => setRetCom(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Datas */}
          <div className='solic-section'>
            <h2 className='solic-section-title'>Período da Atividade</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Data de Início <IconAlert /></label>
                <input
                  type='date'
                  className='solic-input'
                  value={dataInic}
                  onChange={(e) => setDataInic(e.target.value)}
                />
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Data de Término <IconAlert /></label>
                <input
                  type='date'
                  className='solic-input'
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Botão Submit */}
          <div className='solic-footer'>
            <button
              type='submit'
              className={`solic-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className='solic-spinner'></span>
                  Enviando...
                </>
              ) : (
                <>
                  <span className='solic-button-icon'>↳</span>
                  Enviar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SolicPesquisa;