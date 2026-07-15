import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../constants/global';
import NavUser from '../../components/NavUser';

function AlterarDadosUser() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access');

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    ori_sexual: '',
    estado: '',
    municipio: '',
    bairro: '',
    numero: '',
    telefone: '',
    rg: '',
    org_emiss: '',
    cpf: '',
    profissao: '',
    cep: '',
    logradouro: '',
    telefone_fixo: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Aqui carrega os dados já cadastrados
    const carregarDados = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dados_user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error('Não foi possível carregar os dados.');

        setForm({
          first_name: data.user?.first_name || '',
          last_name: data.user?.last_name || '',
          email: data.user?.email || '',
          ori_sexual: data.dados_pessoais?.ori_sexual || '',
          estado: data.dados_pessoais?.estado || '',
          municipio: data.dados_pessoais?.municipio || '',
          bairro: data.dados_pessoais?.bairro || '',
          numero: data.dados_pessoais?.numero || '',
          telefone: data.dados_pessoais?.telefone || '',
          rg: data.dados_pessoais?.rg || '',
          org_emiss: data.dados_pessoais?.org_emiss || '',
          cpf: data.dados_pessoais?.cpf || '',
          profissao: data.dados_pessoais?.profissao || '',
          cep: data.dados_pessoais?.cep || '',
          logradouro: data.dados_pessoais?.logradouro || '',
          telefone_fixo: data.dados_pessoais?.telefone_fixo || '',
        });
      } catch (err) {
        setMessage(err.message || 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/alt_dados_user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(Object.values(data)[0]?.[0] || 'Não foi possível alterar os dados.');
      }

      setMessage('Dados alterados com sucesso!');
    } catch (err) {
      setMessage(err.message || 'Erro ao conectar com o servidor.');
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Carregando...</p>;
  }

  return (
    <>
    <NavUser />
      <div className="container py-4">
        <div className='card shadow-sm'>
          <div className='card-header'>
            <h4 className="mb-4">Alterar dados</h4>
            {message && <div className="alert alert-info">{message}</div>}
          </div>

          <div className='card-body'>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome</label>
                <input name="first_name" className="form-control" value={form.first_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sobrenome</label>
                <input name="last_name" className="form-control" value={form.last_name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">E-mail</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Orientação sexual</label>
                <input name="ori_sexual" className="form-control" value={form.ori_sexual} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <input name="estado" className="form-control" value={form.estado} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Município</label>
                <input name="municipio" className="form-control" value={form.municipio} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bairro</label>
                <input name="bairro" className="form-control" value={form.bairro} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Número</label>
                <input name="numero" type="number" className="form-control" value={form.numero} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Telefone</label>
                <input name="telefone" className="form-control" value={form.telefone} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">RG</label>
                <input name="rg" className="form-control" value={form.rg} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Órgão emissor</label>
                <input name="org_emiss" className="form-control" value={form.org_emiss} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">CPF</label>
                <input name="cpf" className="form-control" value={form.cpf} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Profissão</label>
                <input name="profissao" className="form-control" value={form.profissao} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">CEP</label>
                <input name="cep" className="form-control" value={form.cep} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Logradouro</label>
                <input name="logradouro" className="form-control" value={form.logradouro} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Telefone fixo</label>
                <input name="telefone_fixo" className="form-control" value={form.telefone_fixo} onChange={handleChange} />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary">Salvar alterações</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlterarDadosUser;