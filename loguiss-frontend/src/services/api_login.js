import axios from 'axios'; //biblioteca usada para facilitar a comunicação

const api_login = axios.create({ //create por estar criando uma conexão com o servidor
    baseURL: 'http://localhost:3000/login' // endereço que o backEnd fica(o endpoint vai ser passado depois)
});

export default api_login // sempre lembrar de exportar