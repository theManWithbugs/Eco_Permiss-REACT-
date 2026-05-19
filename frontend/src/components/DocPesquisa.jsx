import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';

function DocPesquisa({ id_pesquisa }) {
  const [docs, setDocs] = useState([]);

  const API_URL = "http://127.0.0.1:8000";

  const getDocPesq = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("⚠️ Você precisa estar logado");
      navigate('/login');
      return;
    }

    const payload = {
      id_pesq: id_pesquisa
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_doc/', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao buscar dados");
      }

      const data = await response.json();
      setDocs(data);

    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
      alert("Houve um erro ao processar sua requisição.");
    }
  }

  useEffect(() => {
    getDocPesq();
  }, []);

  return (
    <>
      {docs.map((doc, index) => (
        <div key={index}>
          <a href={doc.documento} target="_blank">
            {doc.documento}</a>
        </div>
      ))}
    </>
  );
}

export default DocPesquisa;