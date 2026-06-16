import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import NavUser from "./NavUser";
import API_URL from "../constants/global.js";
import { ToastContainer } from 'react-toastify';
import "../styles/btn_paginator.css";

function MinhasSolicPesq() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState();
  const [totalPages, setTotalPages] = useState();
  const token = localStorage.getItem("access");

  function infoPesquisa(item) {
    navigate('/info_pesquisa', { state: item });
  }

  function carregarPagina(numeroDaPagina) {
    if (numeroDaPagina < 1) return;

    fetch(`${API_URL}/api/solic_pesq_user/?page=${numeroDaPagina}`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Aplicar dados em variaveis reservadas
        setDados(data.objs);
        setPaginaAtual(data.currentPage);
        setTotalPages(data.totalPages);
      })
      .catch(error => {
        container_error.innerHTML = `
          <div class="error-message" style="
            padding: 16px;
            background-color: rgba(239, 68, 68, 0.1);
            border-left: 4px solid #ef4444;
            border-radius: 6px;
            color: #991b1b;
            font-weight: 500;
          ">
            ⚠️ Erro ao carregar os dados: ${error.message}
          </div>
        `;
      })
  }

  useEffect(() => {
    if (!token) {
      alert("⚠️ Você precisa estar logado");
      navigate('/login');
      return;
    }
    carregarPagina(1);
  }, []);

  return (
    <>
      <ToastContainer />
      <div className='container bg-white p-2 rounded'>
        <h5 className='pesquisas_title'>Pesquisas | (Solicitadas/Finalizadas)</h5>
        <div id="container_error" className="error-container"></div>
          <br />
          {dados.map((item) => (
            <div className='card_items' key={ item.id }>
              <h5 className='text-uppercase'>{ item.acao_realizada }</h5>
              <div>
                <span>Status: <span style={{ color: item.status === 'APROVADO' ? '#16a34a' : item.status === 'PENDENTE' ? '#78909c' : item.status === 'INDEFERIDO' ? '#dc2626' : '#1565c0', fontWeight: 600 }}>{ item.status }</span></span>
              </div>
              <a style={{ cursor: 'pointer', color: 'white' }} onClick={() => infoPesquisa(item)}>
                Ver detalhes</a>
            </div>
          ))}

          <div className="button-container">
            <button className="button-3d" id="btn-anterior"
            title="Página anterior" onClick={(e) => carregarPagina(paginaAtual - 1)}>
              <div className="button-top">
                <span className="material-icons">❮</span>
              </div>
              <div className="button-bottom"></div>
              <div className="button-base"></div>
            </button>

            <span id="info-pagina" className="info-pagina mt-4">
              Página { paginaAtual } de { totalPages }</span>

            <button className="button-3d" id="btn-proximo"
            title="Próxima página" onClick={(e) => carregarPagina(paginaAtual + 1)}>
              <div className="button-top">
                <span className="material-icons">❯</span>
              </div>
              <div className="button-bottom"></div>
              <div className="button-base"></div>
            </button>
          </div>

      </div>
    </>
  );
}

export default MinhasSolicPesq;