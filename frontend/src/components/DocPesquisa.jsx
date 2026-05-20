import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import ImgPDF from "../img/pdf_img.png";
import API_URL from "../constants/global.js";

function DocPesquisa({ id_pesquisa, status_obj }) {
  const [docs, setDocs] = useState([]);

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
      const response = await fetch(`${API_URL}/api/get_doc/`, {
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


  const excluirArquivo = async (idDocumento) => {
    const token = localStorage.getItem("access");

      if (!token) {
        alert("⚠️ Você precisa estar logado");
        return;
      }

      // Confirmação antes de excluir
      const confirmar = window.confirm("Tem certeza que deseja excluir este documento?");
      if (!confirmar) {
        return;
      }

      // Payload enviado para a API
      const payload = {
        documento_id: idDocumento
      };

      try {
        const response = await fetch(`${API_URL}/api/excluir_arq/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir o documento.");
        }

        // Remove o documento da lista sem precisar recarregar a página
        setDocs((docsAnteriores) =>
          docsAnteriores.filter((doc) => doc.id !== idDocumento)
        );

        // Mensagem de sucesso
        alert("✅ Documento excluído com sucesso!");

        // Caso prefira, você também pode atualizar a lista novamente:
        getDocPesq();

      } catch (error) {
        console.error("Erro ao excluir documento:", error);
        alert("❌ Não foi possível excluir o documento.");
      }
    };


  useEffect(() => {
    getDocPesq();
  }, []);

  function formtNomeDoc(doc) {
    let frmt_name = doc.split("/");
    frmt_name = frmt_name.at(-1);
    return frmt_name;
  }

  function formtDate(data) {
    let frmt_data = data.split("T");
    frmt_data = frmt_data.at(0);
    return frmt_data;
  }

  return (
    <>
      <br />
        <div className="cards-row">
          {docs.map((doc, index) => (
            <div className="col-auto" key={index}>
              {/* <a href={doc.documento} target="_blank"></a> */}
              <div className="card document-card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <img src={ImgPDF} alt="" width="85px" />
                  </div>

                  <h6 className="card-title text-truncate" title={ doc.documento }>
                    { formtNomeDoc(doc.documento) }
                  </h6>

                  <small className="text-muted mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-calendar me-1" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                    </svg>
                    { formtDate(doc.upado_em) }
                  </small>

                  <div className="mt-auto">
                    <a href={doc.documento} target="_blank" className="btn btn-sm btn-primary w-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill me-1" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                      </svg>
                      Visualizar
                    </a>

                    {/* {% if user.is_staff and obj.status == 'APROVADO' %} */}
                    {status_obj === "APROVADO" && (
                      // <form method="POST" action="" className="mt-1">
                      //   {/* {% csrf_token %} */}
                      //   <input type="hidden" name="documento_id" value="" />
                      //   <button className="btn btn-sm btn-danger w-100" type="submit" onclick="return confirm('Tem certeza?')">
                      //     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash me-1" viewBox="0 0 16 16">
                      //       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                      //       <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-11z"/>
                      //     </svg>
                      //     Remover
                      //   </button>
                      // </form>
                      <button onClick={() => excluirArquivo(doc.id)}
                      className="btn btn-sm btn-danger w-100 mt-1">
                        Excluir
                      </button>
                    )}
                    {/* {% endif %} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </>
  );
}

export default DocPesquisa;