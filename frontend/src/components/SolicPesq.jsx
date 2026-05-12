import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/minhas_solic.css";
import "../constants/choices";
import buscarChoicesDoBanco from '../constants/choices';

function SolicPesquisa() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [acao, setAcao] = useState('');
  const [foto, setFoto] = useState('');
  const [licenca, setLicenca] = useState('');
  const [dataInic, setDataInic] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [retComun, setRetCom] = useState('');

  const [unidade, setUnidade] = useState([]);
  const [areaAtuacao, setAreaAtuacao] = useState([]);

  const ucsChoices = [
    { value: "parque_estadual_chandless", label: "Parque Estadual Chandless" },
    { value: "apa_lago_do_amapa", label: "APA Lago do Amapá" },
    { value: "apa_igarape_sao_francisco", label: "APA Igarapé São Francisco" },
    { value: "floresta_estadual_antimary", label: "Floresta Estadual do Antimary" },
    { value: "floresta_estadual_rio_gregorio", label: "Floresta Estadual do Rio Gregório" },
    { value: "floresta_estadual_mogno", label: "Floresta Estadual do Mogno" },
    { value: "floresta_estadual_liberdade", label: "Floresta Estadual Liberdade" },
    { value: "floresta_estadual_afluente", label: "Floresta Estadual Afluente" },
    { value: "arie_japiim_pentecoste", label: "ARIE Japiim Pentecoste" }
  ];

  const areaAtuacaoChoices = [
    { value: "FAUNA", label: "Fauna" },
    { value: "FLORA", label: "Flora" },
    { value: "ECOLOGIA", label: "Ecologia" },
    { value: "GEOLOGIA", label: "Geologia" },
    { value: "SOCIOECONOMIA", label: "Socioeconomia" },
    { value: "ARQUEOLOGIA", label: "Arqueologia" },
    { value: "TURISMO", label: "Turismo" },
    { value: "RECURSOS HIDRICOS", label: "Recursos hidricos" },
    { value: "EDUCAÇÃO AMBIENTAL", label: "Educação Ambiental" },
    { value: "CAVIDADES NATURAIS", label: "Cavidades Naturais" },
    { value: "OUTROS", label: "Outros" }
  ];

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

    const token = localStorage.getItem("access");

    if (!token) {
      alert("⚠️ Você precisa estar logado");
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
      const response = await fetch('http://127.0.0.1:8000/api/solic_pesquisa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // 🔥 ESSENCIAL
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/membros_equipe', { state: data });
      }

      if (!response.ok) {
        setErrors(data);
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

    } catch (error) {
      console.error("❌ ERRO:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  useEffect(() => {
    buscarChoicesDoBanco();
  }, []);

  return (
    <div className='container'>
      <div className='bg-white p-4 rounded shadow-sm'>
        <form onSubmit={handleSubmit}>

          <div className='row'>
            <div className='col-md-6'>
              <label className='fw-bold mb-1'>Ação realizada</label>
              <input
                className='form-control mb-2'
                value={acao}
                onChange={(e) => setAcao(e.target.value)}
              />
              {errors.acao_realizada && <small className="text-danger">{errors.acao_realizada}</small>}
            </div>

            <div className='col-md-6'>
              <label className='fw-bold mb-1'>Fotografias?</label>
              <select
                className='form-select'
                value={foto}
                onChange={(e) => setFoto(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="SIM">SIM</option>
                <option value="NAO">NÃO</option>
              </select>
              {errors.foto && <small className="text-danger">{errors.foto}</small>}
            </div>
          </div>

          <br />

          <div className='row'>
            <div className='col-md-6'>
              <label className='fw-bold'>Área de atuação:</label>
              <div className='border p-2 rounded' style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {areaAtuacaoChoices.map((area) => (
                  <div key={area.value} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={areaAtuacao.includes(area.value)}
                      onChange={() => handleCheckboxChangeArea(area.value)}
                    />
                    <label className="form-check-label">
                      {area.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className='col-md-6'>
              <label className='fw-bold'>Unidades:</label>
              <div className='border p-2 rounded' style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {ucsChoices.map((uc) => (
                  <div key={uc.value} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={unidade.includes(uc.value)}
                      onChange={() => handleCheckboxChangeUnidade(uc.value)}
                    />
                    <label className="form-check-label">
                      {uc.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <br />

          <div className='row'>
            <div className='col-md-6'>
              <label className='fw-bold'>Licença</label>
              <input
                className="form-control"
                value={licenca}
                onChange={(e) => setLicenca(e.target.value)}
              />
            </div>

            <div className='col-md-6'>
              <label className='fw-bold'>Benefícios</label>
              <input
                className='form-control'
                value={retComun}
                onChange={(e) => setRetCom(e.target.value)}
              />
            </div>
          </div>

          <br />

          <div className='row'>
            <div className='col-md-6'>
              <label className='fw-bold'>Data início</label>
              <input
                type="date"
                className='form-control'
                value={dataInic}
                onChange={(e) => setDataInic(e.target.value)}
              />
            </div>

            <div className='col-md-6'>
              <label className='fw-bold'>Data fim</label>
              <input
                type="date"
                className='form-control'
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            Enviar Solicitação
          </button>

        </form>
      </div>
    </div>
  );
}

export default SolicPesquisa;