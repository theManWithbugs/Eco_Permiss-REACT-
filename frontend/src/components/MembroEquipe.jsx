import 'bootstrap/dist/css/bootstrap.min.css';
import NavUser from './NavUser';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function RenderFormset() {
  const navigate = useNavigate();
  const location = useLocation();

  // aceita tanto string quanto objeto { id_pesquisa: ... }
  const id_pesquisa = location.state?.id_pesquisa || location.state;

  // redireciona se não tiver dados
  useEffect(() => {
    if (!location.state) {
      navigate('/minhas_solic');
    }
  }, [location.state, navigate]);

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
      email: ''
    }
  ]);

  const handleInputChange = (id, field, value) => {
    const updateFormsets = formsets.map((form) => {
      if (form.id === id) {
        return { ...form, [field]: value };
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

    const payload = {
      formsets: formsets,
      id_pesquisa: id_pesquisa
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/receber_dados/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        alert(data);
      } else {
        alert("❌ Erro no servidor ao salvar.");
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
      email: ''
    };
    setFormsets([...formsets, novoForm]);
  };

  return (
    <>
      <NavUser />

      <div className='container' style={{ marginTop: '10rem' }}>
        {formsets.map((form, index) => (
          <div key={form.id} className='card p-3 mb-3 border'>
            <h5 className='mb-3'>Membro #{index + 1}</h5>

            <div className='row g-3 mb-3'>
              <div className='col-md-4'>
                <label className='form-label'>Nome:</label>
                <input
                  type='text'
                  className='form-control'
                  value={form.nome}
                  onChange={(e) => handleInputChange(form.id, 'nome', e.target.value)}
                  maxLength={80}
                />
              </div>

              <div className='col-md-4'>
                <label className="form-label">CPF:</label>
                <input
                  type="text"
                  className='form-control'
                  value={form.cpf}
                  onChange={(e) => handleInputChange(form.id, 'cpf', e.target.value)}
                  maxLength={11}
                />
              </div>

              <div className='col-md-4'>
                <label className='form-label'>RG:</label>
                <input
                  type="text"
                  className='form-control'
                  value={form.rg}
                  onChange={(e) => handleInputChange(form.id, 'rg', e.target.value)}
                  maxLength={11}
                />
              </div>
            </div>

            <div className='row g-3'>
              <div className='col-md-4'>
                <label className='form-label'>Orientação sexual:</label>
                <select
                  className='form-select'
                  value={form.ori_sexual}
                  onChange={(e) => handleInputChange(form.id, 'ori_sexual', e.target.value)}
                >
                  {oriChoices.map((ori) => (
                    <option key={ori.value} value={ori.value}>
                      {ori.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='col-md-4'>
                <label className='form-label'>Instituição:</label>
                <input
                  type="text"
                  className='form-control'
                  value={form.instituicao}
                  onChange={(e) => handleInputChange(form.id, 'instituicao', e.target.value)}
                  maxLength={80}
                />
              </div>

              <div className='col-md-4'>
                <label className='form-label'>Email:</label>
                <input
                  type="text"
                  className='form-control'
                  value={form.email}
                  onChange={(e) => handleInputChange(form.id, 'email', e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-3">
          <button onClick={createFormset} className="btn btn-primary me-2">
            More
          </button>
          <button onClick={enviarDados} className='btn btn-success'>
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}

export default RenderFormset;