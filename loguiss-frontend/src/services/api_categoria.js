import axios from 'axios'; //biblioteca usada para facilitar a comunicação

const api_categoria = axios.create({ //create por estar criando uma conexão com o servidor
    baseURL: 'http://localhost:3000/categoria' // endereço que o backEnd fica(o endpoint vai ser passado depois)
});

export default api_categoria // sempre lembrar de exportar