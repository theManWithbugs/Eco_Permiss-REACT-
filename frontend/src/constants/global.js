import { toast } from "react-toastify";
import Swal from 'sweetalert2'

const API_URL = "http://127.0.0.1:8000";
const token = localStorage.getItem("access");

/**
 * --- PRINCIPAIS CÓDIGOS DE STATUS HTTP PARA TRATAMENTO NO JS ---
 *
 * 🟢 SUCESSO (200 - 299)
 * 200 - OK: Requisição bem-sucedida.
 * 201 - Created: Novo recurso criado com sucesso (comum em POST).
 * 204 - No Content: Sucesso, mas o servidor não retorna nenhum corpo.
 *
 * 🟡 ERROS DO CLIENTE (400 - 499)
 * 400 - Bad Request: Dados inválidos ou formato incorreto enviado pelo JS.
 * 401 - Unauthorized: Usuário não autenticado (falta token ou login).
 * 403 - Forbidden: Autenticado, mas sem permissão para acessar o recurso.
 * 404 - Not Found: A URL ou o recurso buscado não existe.
 * 422 - Unprocessable Entity: Formato correto, mas dados falharam na validação.
 *
 * 🔴 ERROS DO SERVIDOR (500 - 599)
 * 500 - Internal Server Error: O servidor quebrou ou encontrou um erro interno.
 * 503 - Service Unavailable: Servidor temporariamente fora do ar ou em manutenção.
 */

export function showToast(status, message) {
  if ([200, 201, 204].includes(status)) {
    toast.success(message);
  } else if ([400, 401, 403, 404].includes(status)) {
    toast.error(message);
  } else if ([500, 503].includes(status)) {
    toast.warning(message);
  }
}

export const getUserData = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/dados_user/`, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      showToast(response.status, `Não foi possível obter os dados!`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    return data;
  } catch (error) {
    showToast(500, `Ocorreu um erro: ${error.message}`);
    return null;
  }
}

export function formatar_username(first_name, last_name) {
    const first_name_frmt = first_name.toLowerCase();
    const last_name_fmrt = last_name.toLowerCase();
    const username = `${first_name_frmt}.${last_name_fmrt}`;
    return username;
}

// Vai servir sempre que houver necessidade de pegar dados de uma solicitação de UGAI
export const dataInfoUgai = async (token, id_public) => {
  try {
    const response = await fetch(`${API_URL}/api/info_ugai/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id_public)
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(500, 'Ocorreu um erro!');
    }
    console.log(data);
    return data;

  } catch (error) {
    alert(`Ocorreu um erro! ${error}`);
  }
}

export const dataInfoPesq = async (token, id_public) => {
  try {
    const response = await fetch(`${API_URL}/api/info_pesq/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(id_public)
    });

    const data = await response.json();
    if (!response.ok) {
      showToast(500, 'Ocorreu um erro!');
    }
    return data;

  } catch (error) {
    alert(`Ocorreu um erro! ${error}`);
  }
}

export default API_URL;
