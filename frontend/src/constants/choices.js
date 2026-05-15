export const buscarChoicesDoBanco = () => {
  const token = localStorage.getItem("access");

  if (!token) {
    alert("⚠️ Você precisa estar logado");
    return Promise.reject("Sem token");
  }

  return fetch('http://127.0.0.1:8000/api/get_choices/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Falha ao carregar opções do servidor");
    }
    // Primeiro convertemos para JSON
    return response.json();
  })
  .then(data => {
    // Agora sim conseguimos ver os dados e usá-los
    // console.log("Dados recebidos do banco:",data);
    return data;
  })
  .catch(error => {
    console.error("Erro na busca de choices:", error);
    throw error;
  });
};

export default buscarChoicesDoBanco;
