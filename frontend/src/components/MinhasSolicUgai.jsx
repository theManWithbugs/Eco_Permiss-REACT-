import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MinhasSolicUgai() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);

  const buscarDados = async () => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("", {
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
  }

  return (
    <div className='container bg-white p-2 rounded'>
      <h5>UGAI | (Solicitadas/Finalizadas)</h5>
    </div>
  );
}

export default MinhasSolicUgai;