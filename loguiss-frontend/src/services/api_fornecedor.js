import axios from 'axios'; //biblioteca usada para facilitar a comunicação

const api_fornecedor = axios.create({ //create por estar criando uma conexão com o servidor
    baseURL: 'http://localhost:3000/fornecedor' // endereço que o backEnd fica(o endpoint vai ser passado depois)
});

export default api_fornecedor // sempre lembrar de exportar