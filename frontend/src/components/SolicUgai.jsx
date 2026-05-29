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
  const [ugai, setUgai] = useState('');

  // form
  const [instituicao, setInstituicao] = useState('');
  const [setor, setSetor] = useState('');
  const [cargo, setCargo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("access");
    if (!token) {
      navigate('/login');
      return;
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

        setChoicesUgais(choicesUgais);

        choicesUgais.forEach(Element => {
          console.log(Element["value"], Element["label"]);
        });

      } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
      }
    };
    loadChoices();
  }, []);

  return (
    <div className='solic-container'>
      <div className='solic-wrapper'>
        <form onSubmit={handleSubmit} className='solic-form'>
          <div className='solic-section'>
            <h2 className='solic-section-title'>Informações Básicas</h2>
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Selecione a unidade de gestão integrada</label>
                <select
                  className='solic-select'
                  value={ugai}
                  maxLength={14}
                  onChange={(e) => setUgai(e.target.value)}
                >
                  {choicesUgais.map((element) => (
                    <option value={element.value} key={element.value}>
                      {element.label}</option>
                  ))};
                </select>
              </div>
            </div>
              <br />
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <label className='solic-label'>Instituição</label>
                <input
                  className='solic-input'
                  placeholder='Instituição na qual faz parte'
                  value={instituicao}
                  maxLength={40}
                  onChange={(e) => setRetCom(e.target.value)}
                />
              </div>
              <div className='solic-field'>
                <label className='solic-label'>Setor</label>
                <input
                  className='solic-input'
                  placeholder='Setor no qual faz parte'
                  value={setor}
                  maxLength={40}
                  onChange={(e) => setSetor(e.target.value)}
                />
              </div>
            </div>
              <br />
            <div className='solic-grid-2'>
              <div className='solic-field'>
                <div className='solic-label'>Cargo</div>
                <input
                  className='solic-input'
                  value={cargo}
                  maxLength={40}
                  onChange={(e) => setCargo(e.target.value)}
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

export default SolicUgai;