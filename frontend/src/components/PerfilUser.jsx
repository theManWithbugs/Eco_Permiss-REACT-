import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../auth/components/auth";
import { toast } from 'react-toastify';
import { getUserData } from '../constants/global';

function PerfilUser() {
  // Preciso gravar isso, pois é quando inicia um array
  const [dadosUser, setDadosUser] = useState({});
  const [dadosPessoais, setDadosPessoais] = useState({});
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleEditar = () => {
    navigate("/alt_dados");
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const carregarDadosUser = async () => {
      try {
        const userData = await getUserData(token);
        if (userData) {
          setDadosUser(userData.user);
          setDadosPessoais(userData.dados_pessoais);
        }
      } catch (error) {
        toast.error("Não foi possível obter as opções disponíveis!");
      }
    }
    carregarDadosUser();

  }, [])

  return (
    <div className='container mt-3'>
      <div className='card shadow-sm'>
        <div className='card-header'>
          <div className='row gap-1'>
            <div className='col-md-auto'>
              <h5 className='mb-0'>{dadosUser?.first_name}</h5>
            </div>
            <div className='col-md-auto ms-auto'>
              <a onClick={(e) => {e.preventDefault();handleEditar();}}
              className='btn btn-outline-secondary'>
                Editar</a>
            </div>
            <div className='col-md-auto'>
              <a onClick={(e) => {e.preventDefault();handleLogout();}}
                className='btn btn-outline-danger'>
                Sair</a>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <h5 className='text-secondary mb-3'>Informações Pessoais</h5>
          <table className='table table-hover'>
            <tbody>
              <tr>
                <th scope='row'>Nome Completo</th>
                <td>{dadosUser?.first_name} {dadosUser?.last_name}</td>
              </tr>
              <tr>
                <th scope='row'>Orientação Sexual:</th>
                <td>{dadosPessoais?.ori_sexual}</td>
              </tr>
              <tr>
                <th scope='row'>Estado:</th>
                <td>{dadosPessoais?.estado}</td>
              </tr>
              <tr>
                <th scope='row'>CEP:</th>
                <td>{dadosPessoais?.cep}</td>
              </tr>
              <tr>
                <th scope='row'>Municipio:</th>
                <td>{dadosPessoais?.municipio}</td>
              </tr>
              <tr>
                <th scope='row'>Bairro:</th>
                <td>{dadosPessoais?.bairro}</td>
              </tr>
              <tr>
                <th scope='row'>Logradouro:</th>
                <td>{dadosPessoais?.logradouro}</td>
              </tr>
              <tr>
                <th scope='row'>Número:</th>
                <td>{dadosPessoais?.numero}</td>
              </tr>
              <tr>
                <th scope='row'>Email:</th>
                <td>{dadosUser?.email}</td>
              </tr>
              <tr>
                <th scope='row'>Telefone:</th>
                <td>{dadosPessoais?.telefone}</td>
              </tr>
              <tr>
                <th scope='row'>RG:</th>
                <td>{dadosPessoais?.rg}</td>
              </tr>
              <tr>
                <th scope='row'>Orgão Emissor do RG:</th>
                <td>{dadosPessoais?.org_emiss}</td>
              </tr>
              <tr>
                <th scope='row'>CPF:</th>
                <td>{dadosPessoais?.cpf}</td>
              </tr>
              <tr>
                <th scope='row'>Profissão:</th>
                <td>{dadosPessoais?.profissao}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* "?." evita tela branca caso não carregue */}
    </div>
  );
}

export default PerfilUser;