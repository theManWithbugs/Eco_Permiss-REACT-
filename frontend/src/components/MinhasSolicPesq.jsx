import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import NavUser from "./NavUser";

function MinhasSolicPesq() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);

  const buscarDados = async () => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/minhas_solic/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      setDados(data);

    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  function infoPesquisa(item) {
    navigate('/info_pesquisa', { state: item });
  }

  return (

      <div className='container bg-white p-2 rounded' style={{ marginTop: '150px' }}>
        <h5 className='pesquisas_title'>Pesquisas | (Solicitadas/Finalizadas)</h5>
        <div id="container_error" className="error-container"></div>

        <br />

          {dados.map((item) => (
            <div className='card_items' key={item.id}>
              <h5 className='text-uppercase'>{item.acao_realizada}</h5>
              <a style={{ cursor: 'pointer', color: 'white' }} onClick={() => infoPesquisa(item)}>
                Ver detalhes</a>
              <p>ID atual: { item.id }</p>
            </div>
          ))}

        <div>
          <button>Proxima</button>
          <button>Anterior</button>
        </div>

      </div>

  );
}

export default MinhasSolicPesq;