import { toast } from "react-toastify";
import Swal from 'sweetalert2'

const API_URL = "http://127.0.0.1:8000";

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

export default API_URL;