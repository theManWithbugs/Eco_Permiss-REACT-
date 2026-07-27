import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';
import API_URL from '../constants/global';
import { IconReload } from './IconesProntos';

function AlterarDocSolic({ id_pesq }) {
  const [documentos, setDocumentos] = useState({
    doc_ident: [],
    doc_cpf: [],
    doc_seg_vida: [],
    licenca: [],
    outros: []
  });

  const token = localStorage.getItem("access");

  const formIdent = new FormData();
  const formCPF = new FormData();
  const formSegVida = new FormData();

  function clearForm(formData) {
    const keys = [];

    for (let key of formData.keys()) {
      keys.push(key);
    }

    keys.forEach(key => formData.delete(key));

    return formData;
  }

  const handleIdent = (campo, event) => {
    const arquivoSelecionado = event.target.files?.[0];

    if (!arquivoSelecionado) return;

    const maxSizeBytes = 5 * 1024 * 1024;

    if (arquivoSelecionado.size > maxSizeBytes) {
      toast.warning("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
      event.target.value = "";
      return;
    }

    clearForm(formIdent);
    formIdent.append(campo, arquivoSelecionado);

    SendFile(formIdent);
  };

  const handleCPF = (campo, event) => {
    const arquivoSelecionado = event.target.files?.[0];

    if (!arquivoSelecionado) return;

    const maxSizeBytes = 5 * 1024 * 1024;

    if (arquivoSelecionado.size > maxSizeBytes) {
      toast.warning("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
      event.target.value = "";
      return;
    }

    clearForm(formCPF);
    formCPF.append(campo, arquivoSelecionado);

    SendFile(formCPF);
  };

  const handleSegVida = (campo, event) => {
    const arquivoSelecionado = event.target.files?.[0];

    if (!arquivoSelecionado) return;

    const maxSizeBytes = 5 * 1024 * 1024;

    if (arquivoSelecionado.size > maxSizeBytes) {
      toast.warning("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
      event.target.value = "";
      return;
    }

    clearForm(formSegVida);
    formSegVida.append(campo, arquivoSelecionado);

    SendFile(formSegVida);
  };

  async function SendFile(formFile) {
    formFile.append("pesquisa_id", id_pesq);

    try {
      const response = await fetch(`${API_URL}/api/change_file_solic/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formFile,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao alterar o documento.");
        return;
      }

      toast.success(
        data.message || "Documento alterado com sucesso!",
        {
          autoClose: 2000
        }
      );

      setTimeout(() => {
        window.location.reload();
      }, 2200);

    } catch (error) {
      console.error(error);

      toast.error(
        "Não foi possível conectar ao servidor."
      );
    }
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <div className='container mt-4'>
        <div className='ip-section-label'>
          <IconReload />
          Alterar documentos do solicitante
        </div>

        <div className='row'>
          <div className='col-md-4'>
            <label className='solic-upload'>
              <input
                type="file"
                name="doc_ident"
                accept=".pdf"
                onChange={(event) => handleIdent('doc_ident', event)}
              />
              <span className='solic-upload-box'>
                <span className='solic-upload-icon'>📎</span>
                <span className='solic-upload-text'>
                  IDENTIFICAÇÃO (RG/CNH)
                </span>
              </span>
            </label>
          </div>
            <div className='col-md-4'>
              <label className='solic-upload'>
                <input
                  type="file"
                  name="doc_cpf"
                  accept=".pdf"
                  onChange={(event) => handleCPF('doc_cpf', event)}
                />
                <span className='solic-upload-box'>
                  <span className='solic-upload-icon'>📎</span>
                  <span className='solic-upload-text'>
                    CPF
                  </span>
                </span>
              </label>
            </div>
          <div className='col-md-4'>
            <label className='solic-upload'>
              <input
                type="file"
                name="doc_seg_vida"
                accept=".pdf"
                onChange={(event) => handleSegVida('doc_seg_vida', event)}
              />
              <span className='solic-upload-box'>
                <span className='solic-upload-icon'>📎</span>
                <span className='solic-upload-text'>
                  SEGURO DE VIDA
                </span>
              </span>
            </label>
          </div>
        </div>

      </div>
    </>
  );
}

export default AlterarDocSolic;