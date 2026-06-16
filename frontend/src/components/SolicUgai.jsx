import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from "../constants/global.js";
import buscarChoicesDoBanco from '../constants/choices';
import '../styles/solic_pesq.css';

function SolicUgai() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [choicesUgais, setChoicesUgais] = useState([]);
  const [choicesUgaisDict, setChoicesUgaiDict] = useState([]);

  const [ugai, setUgai] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [setor, setSetor] = useState('');
  const [cargo, setCargo] = useState('');
  const [ativDesenv, setAtivDesenv] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFinal, setDataFinal] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("access");
    if (!token) {
      navigate('/login');
      return;
    }

    const payload = {
      ugai,
      instituicao,
      setor,
      cargo,
      ativ_desenv: ativDesenv,
      publico_alvo: publicoAlvo,
      data_inicio: dataInicio,
      data_final: dataFinal,
    };

    try {
      const response = await fetch(`${API_URL}/api/solic_ugai/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data);
        setLoading(false);
        return;
      }

      setErrors({});
      navigate('/minhas_solic');
    } catch (erro) {
      console.error("Erro ao enviar solicitação:", erro);
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadChoices = async () => {
      try {
        const choices = await buscarChoicesDoBanco();

        const choicesUgais = choices["choices_ugais"].map(([chave, nome]) => ({
          value: chave,
          label: nome
        }));

        const choicesUgaisDict = choices["ugais"].map((item) => ({
          value: item.id,
          label: item.nome
        }));

        setChoicesUgais(choicesUgais);
        setChoicesUgaiDict(choicesUgaisDict);
      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };

    loadChoices();
  }, []);

  return (
    <div className='solic-container'>
      <div className='solic-wrapper'>
        <div className='solic-header'>
          <div className='solic-header-content'>
            <h1 className='solic-title'>Solicitação de UGAI</h1>
            <p className='solic-subtitle'>Preencha os dados necessários para solicitar o uso da unidade.</p>
          </div>
          <div className='solic-accent-shape'></div>
        </div>

        <form onSubmit={handleSubmit} className='solic-form'>
          <div className='solic-section'>
            <h2 className='solic-section-title'>Dados da Unidade</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Unidade de gestão integrada</label>
                <select
                  className='solic-select'
                  value={ugai}
                  onChange={(e) => setUgai(e.target.value)}
                >
                  <option value=''>Selecione a UGAI</option>
                  {choicesUgaisDict.map((item) => (
                    <option value={item.value}>{ item.label }</option>
                  ))}

                </select>
                {errors.ugai && <span className='solic-error'>{errors.ugai}</span>}
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Instituição</label>
                <input
                  className='solic-input'
                  placeholder='Instituição na qual faz parte'
                  value={instituicao}
                  maxLength={40}
                  onChange={(e) => setInstituicao(e.target.value)}
                />
                {errors.instituicao && <span className='solic-error'>{errors.instituicao}</span>}
              </div>
            </div>
              <br />
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Setor</label>
                <input
                  className='solic-input'
                  placeholder='Setor no qual faz parte'
                  value={setor}
                  maxLength={40}
                  onChange={(e) => setSetor(e.target.value)}
                />
                {errors.setor && <span className='solic-error'>{errors.setor}</span>}
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Cargo</label>
                <input
                  className='solic-input'
                  placeholder='Cargo exercido'
                  value={cargo}
                  maxLength={40}
                  onChange={(e) => setCargo(e.target.value)}
                />
                {errors.cargo && <span className='solic-error'>{errors.cargo}</span>}
              </div>
            </div>
          </div>

          <div className='solic-section'>
            <h2 className='solic-section-title'>Atividades e Público</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Atividades que irá desenvolver</label>
                <textarea
                  className='solic-input'
                  placeholder='Descreva as principais atividades'
                  value={ativDesenv}
                  maxLength={200}
                  rows={4}
                  onChange={(e) => setAtivDesenv(e.target.value)}
                />
                {errors.ativ_desenv && <span className='solic-error'>{errors.ativ_desenv}</span>}
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Público alvo</label>
                <textarea
                  className='solic-input'
                  placeholder='Descreva o público atendido'
                  value={publicoAlvo}
                  maxLength={80}
                  rows={4}
                  onChange={(e) => setPublicoAlvo(e.target.value)}
                />
                {errors.publico_alvo && <span className='solic-error'>{errors.publico_alvo}</span>}
              </div>
            </div>
          </div>

          <div className='solic-section'>
            <h2 className='solic-section-title'>Período da solicitação</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Data de início</label>
                <input
                  type='date'
                  className='solic-input'
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
                {errors.data_inicio && <span className='solic-error'>{errors.data_inicio}</span>}
              </div>

              <div className='solic-field'>
                <label className='solic-label'>Data de término</label>
                <input
                  type='date'
                  className='solic-input'
                  value={dataFinal}
                  onChange={(e) => setDataFinal(e.target.value)}
                />
                {errors.data_final && <span className='solic-error'>{errors.data_final}</span>}
              </div>
            </div>
          </div>

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

export default SolicUgai;