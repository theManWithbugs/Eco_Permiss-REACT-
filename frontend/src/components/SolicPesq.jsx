import { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buscarChoicesDoBanco from '../constants/choices';
import API_URL from "../constants/global.js";
import '../styles/solic_pesq.css';
import '../styles/file_info_form.css';
import ImgPDF from "../img/pdf_img.png";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

function SolicPesquisa() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [acao, setAcao] = useState('');
  const [foto, setFoto] = useState('');
  const [licenca, setLicenca] = useState('');
  const [dataInic, setDataInic] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [retComun, setRetCom] = useState('');

  const [unidade, setUnidade] = useState([]);
  const [areaAtuacao, setAreaAtuacao] = useState([]);

  const [choicesUCS, setChoicesUCS] = useState([]);
  const [choicesArea, setChoicesArea] = useState([]);

  const [checkAceite, setCheckAceite] = useState(false);

  const handleCheckboxChangeUnidade = (value) => {
    setUnidade((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
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

    const token = localStorage.getItem("access");

    if (!token) {
      navigate('/login');
      return;
    }

    if (checkAceite === false) {
      toast.warning("Faz se necessario o aceite dos termos!");
      setLoading(false);
      return;
    }

    const payload = {
      acao_realizada: acao,
      unidade_cons: unidade.join(","),
      foto,
      licenca_inst: licenca,
      inicio_atividade: dataInic,
      final_atividade: dataFim,
      retorno_comuni: retComun,
      area_atuacao: areaAtuacao.join(","),
    };

    try {
      const response = await fetch(`${API_URL}/api/solic_pesquisa/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        navigate('/membros_equipe', { state: data });
      }

      if (!response.ok) {
        setErrors(data);
        setLoading(false);
        return;
      }

      // RESET
      setErrors({});
      setAcao('');
      setUnidade([]);
      setFoto('');
      setLicenca('');
      setDataInic('');
      setDataFim('');
      setRetCom('');
      setAreaAtuacao([]);
      setLoading(false);

    } catch (error) {
      console.error("❌ ERRO:", error);
      alert("Erro ao conectar com o servidor");
      setLoading(false);
    }
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
          <div className="col-md-6 shadow-sm">
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
        </div>

        <form onSubmit={handleSubmit} className='solic-form'>
          {/* Seção 1: Ação e Fotos */}
          <div className='solic-section'>
            <h2 className='solic-section-title'>Informações Básicas</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Ação realizada</label>
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
                <label className='solic-label'>Fotografias?</label>
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
                <label className='solic-label'>Área de atuação</label>
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
                <label className='solic-label'>Unidades de Conservação</label>
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
            <h2 className='solic-section-title'>Documentação</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Número de Licença</label>
                <input
                  className='solic-input'
                  placeholder='Ex: IBAMA 2024/001'
                  value={licenca}
                  maxLength={120}
                  onChange={(e) => setLicenca(e.target.value)}
                />
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Benefícios Gerados</label>
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
                <label className='solic-label'>Data de Início</label>
                <input
                  type='date'
                  className='solic-input'
                  value={dataInic}
                  onChange={(e) => setDataInic(e.target.value)}
                />
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Data de Término</label>
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