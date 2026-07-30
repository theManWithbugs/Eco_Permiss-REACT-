import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import buscarChoicesDoBanco from '../constants/choices';
import API_URL from '../constants/global';

const FORM_INICIAL = () => ({
  id: Date.now() + Math.random(),
  nome: '',
  email: '',
  telefone: '',
  cor_raca: '',
  genero: '',
  data_nasc: ''
})

function MembroEquipeUGAI() {
  const { state } = useLocation();
  const id = state;
  const token = localStorage.getItem("access");
  const navigate = useNavigate();
  // const [nome, setNome] = useState("");
  // const [email, setEmail] = useState("");
  // const [telefone, setTelefone] = useState("");

  const [choicesRaca, setChoicesRaca] = useState([]);
  const [choicesGenero, setChoicesGenero] = useState([]);

  const [formsets, setFormsets] = useState([FORM_INICIAL()]);

  const [raca, setRaca] = useState();
  const [genero, setGenero] = useState();
  // const [dataNasc, setDataInic] = useState("");

  const handleInputChange = (formId, field, value) => {
    // X é o estado anterior
    setFormsets(x => {
      const novaLista = [];

      // Percorre todos os formsets
      for (let i = 0; i < x.length; i++) {
        const form = x[i];

        if (form.id === formId) {
          const formAtualizado = Object.assign({}, form); //Aqui ele copia todas as propiedades do form
          formAtualizado[field] = value; // Estou sobreescrevendo o campo que mudou
          novaLista.push(formAtualizado);
        } else {
          // Se não é o que quero mudar mantenho como está
          novaLista.push(form);
        }
      }
      // Retorna o array atualizado
      return novaLista;
    })
  }

  const criarFormset = () => {
    // Roda dentro da variavel de formsets
    setFormsets(x => {
      const membroNovo = FORM_INICIAL(); // Cria um objeto vazio novo com base no defindo em FORM_INICIAL()
      const listaAtualizada = x.concat(membroNovo); // Junta a lista antiga com o ojeto novo
      return listaAtualizada; // Retorna a lista atualizada com o objeto novo incluido
    });
  };

  const excluirFormset = (formId) => {
    if (formsets.length <= 1) {
      alert('⚠️ Você precisa manter pelo menos um membro');
      return;
    }
    setFormsets(x => {
      const listaSemOMembro = [];

      for (let i = 0; i < x.length; i++) {
        const form = x[i];

        // Eu percorro todos e só adiciono a variavel aos que não são iguais ao id fornecido
        if (form.id !== formId) {
          listaSemOMembro.push(form);
        }
      }
      return listaSemOMembro;
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/membros_equipe_ugai/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}` ,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_solic: id,
          formsets: formsets
        })
      });

      const data = await response.json();

    } catch (error) {
      alert(`Ocorreu um erro! ${error}`);
    }
  }

  useEffect(() => {
    if (!id) {
      navigate('/minhas_solic');
    }

    const carregar_choices = async () => {
      try {
        const choices = await buscarChoicesDoBanco();

        const choices_raca_ = choices["choices_raca"].map(([chave, nome]) => ({
          value: chave,
          label: nome
        }));

        const choices_genero = choices["genero"].map(([chave, nome]) => ({
          value: chave,
          label: nome
        }));

        setChoicesRaca(choices_raca_);
        setChoicesGenero(choices_genero);
      } catch (error) {
        toast.error("Não foi possível obter as opções disponíveis!");
      }
    }
    carregar_choices();
  }, [])

  return (
    <>
      <div className='container'>s
        <button onClick={criarFormset}>Adicionar membro</button>
      </div>

      <form onSubmit={handleSubmit} className='container'>
        {formsets.map((form, index) => (
          <div key={form.id}>
            <label className='form-label' htmlFor='nome'>Nome Completo</label>
            <input
              id='nome'
              className='form-control'
              type="text"
              value={form.nome}
              maxLength={80}
              onChange={e => handleInputChange(form.id, 'nome', e.target.value)}
            />

            <label className='form-label' htmlFor='email'>Email</label>
            <input
              id='email'
              className='form-control'
              type="text"
              value={form.email}
              maxLength={150}
              onChange={e => handleInputChange(form.id, 'email', e.target.value)}
            />

            <label htmlFor="telefone" className='form-label'>Contato</label>
            <input
              id='telefone'
              className='form-control'
              type="text"
              value={form.telefone}
              maxLength={11}
              onChange={e => handleInputChange(form.id, 'telefone', e.target.value)}
            />

            <select
              className='form-select mt-4'
              value={form.genero}
              onChange={(e) => handleInputChange(form.id, 'genero', e.target.value)}
            >
              <option value="">Selecione seu genero</option>
                {choicesGenero.map((genero) => (
                  <option value={genero.value} key={genero.value}>{ genero.label }</option>
                ))}
            </select>

            <label htmlFor="data_nasc" className='mt-3'>Data de nascimento:</label><br />
            <input
              className='rounded'
              id='data_nasc'
              type="date"
              value={form.data_nasc}
              maxLength={11}
              onChange={e => handleInputChange(form.id, 'data_nasc', e.target.value)}
            />

            <select
              className='form-select mt-4'
              value={form.cor_raca}
              onChange={(e) => handleInputChange(form.id, 'cor_raca', e.target.value)}
            >
              <option value="">Selecionar raça</option>
                {choicesRaca.map((raca) => (
                  <option value={raca.value} key={raca.value}>{ raca.label }</option>
                ))}
            </select>

            {formsets.length > 1 && (
              <div style={{ marginTop: '1rem' }}>
                <button
                  type='button'
                  onClick={() => excluirFormset(form.id)}
                >
                  ✕ Remover Membro
                </button>
              </div>
            )}
          </div>
        ))}
        <button type='submit' className='mt-4 btn btn-info'>Enviar</button>
      </form>
    </>
  );
}

export default MembroEquipeUGAI;