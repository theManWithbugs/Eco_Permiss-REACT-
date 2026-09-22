import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import buscarChoicesDoBanco from '../constants/choices';
import API_URL from '../constants/global';
import styled from "styled-components";
import {
  Pagina,
  Cabecalho,
  Titulo,
  BotaoAdicionar,
  Formulario,
  CartaoMembro,
  CabecalhoMembro,
  NumeroMembro,
  Grade,
  Campo,
  Label,
  Input,
  Select,
  BotaoRemover,
  RodapeForm,
  BotaoEnviar
} from '../styles/equipe_ugai';
import NavUser from './NavUser';

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
      navigate('/info_ugai', { state: data });

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
      <NavUser/>
      <Pagina>
        <Cabecalho>
          <Titulo>
            <h1>Equipe da pesquisa</h1>
            <p>Cadastre os membros que participarão da atividade na UGAI</p>
          </Titulo>
          <BotaoAdicionar type="button" onClick={criarFormset}>+ Adicionar membro</BotaoAdicionar>
        </Cabecalho>

        <Formulario onSubmit={handleSubmit}>
          {formsets.map((form, index) => (
            <CartaoMembro key={form.id}>
              <CabecalhoMembro>
                <NumeroMembro>Membro {index + 1}</NumeroMembro>
                {formsets.length > 1 && (
                  <BotaoRemover type='button' onClick={() => excluirFormset(form.id)}>
                    ✕ Remover
                  </BotaoRemover>
                )}
              </CabecalhoMembro>

              <Grade>
                <Campo $largo>
                  <Label htmlFor='nome'>Nome Completo</Label>
                  <Input
                    id='nome'
                    type="text"
                    value={form.nome}
                    maxLength={80}
                    onChange={e => handleInputChange(form.id, 'nome', e.target.value)}
                  />
                </Campo>

                <Campo>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type="text"
                    value={form.email}
                    maxLength={150}
                    onChange={e => handleInputChange(form.id, 'email', e.target.value)}
                  />
                </Campo>

                <Campo>
                  <Label htmlFor="telefone">Contato</Label>
                  <Input
                    id='telefone'
                    type="text"
                    value={form.telefone}
                    maxLength={11}
                    onChange={e => handleInputChange(form.id, 'telefone', e.target.value)}
                  />
                </Campo>

                <Campo>
                  <Label htmlFor="genero">Gênero</Label>
                  <Select
                    id="genero"
                    value={form.genero}
                    onChange={(e) => handleInputChange(form.id, 'genero', e.target.value)}
                  >
                    <option value="">Selecione seu genero</option>
                      {choicesGenero.map((genero) => (
                        <option value={genero.value} key={genero.value}>{ genero.label }</option>
                      ))}
                  </Select>
                </Campo>

                <Campo>
                  <Label htmlFor="data_nasc">Data de nascimento</Label>
                  <Input
                    id='data_nasc'
                    type="date"
                    value={form.data_nasc}
                    maxLength={11}
                    onChange={e => handleInputChange(form.id, 'data_nasc', e.target.value)}
                  />
                </Campo>

                <Campo>
                  <Label htmlFor="cor_raca">Raça/Cor</Label>
                  <Select
                    id="cor_raca"
                    value={form.cor_raca}
                    onChange={(e) => handleInputChange(form.id, 'cor_raca', e.target.value)}
                  >
                    <option value="">Selecionar raça</option>
                      {choicesRaca.map((raca) => (
                        <option value={raca.value} key={raca.value}>{ raca.label }</option>
                      ))}
                  </Select>
                </Campo>
              </Grade>
            </CartaoMembro>
          ))}

          <RodapeForm>
            <BotaoEnviar type='submit'>Enviar</BotaoEnviar>
          </RodapeForm>
        </Formulario>
      </Pagina>
    </>
  );
}

export default MembroEquipeUGAI;