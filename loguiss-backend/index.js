import express from 'express';
import cors from 'cors';
import router_login from './routes/routes_login.js';
import router_categoria from './routes/routes_categoria.js';
import router_receita from './routes/routes_receita.js';
import router_produto from './routes/routes_produto.js';
import router_fornecedor from './routes/routes_fornecedor.js';
import router_unidade_medida from './routes/routes_unidade_medida.js';
import router_cliente from './routes/routes_clientes.js';
import router_user from './routes/routes_user.js';
import router_movimentacao from './routes/routes_movimentacao.js';
import router_dashboard from './routes/router_dashboard.js';
import router_empresa from './routes/routes_empresa.js';
import router_config_ia from './routes/configuracaoIA.routes.js'
import router_previsao from './routes/previsao.routes.js'
import router_producao from './routes/routes_producao.js';
import autenticarToken from './middlewares/authMiddleware.js';
import { iniciarAgendador } from './jobs/agendadorPrevisao.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use("/login", router_login);
app.use("/categoria", autenticarToken, router_categoria);
app.use("/receita", autenticarToken, router_receita);
app.use("/produto", autenticarToken, router_produto);
app.use("/fornecedor", autenticarToken, router_fornecedor);
app.use("/unidade_medida", autenticarToken, router_unidade_medida);
app.use("/cliente", autenticarToken, router_cliente);
app.use("/user", autenticarToken, router_user);
app.use("/movi", autenticarToken, router_movimentacao);
app.use("/producao", autenticarToken, router_producao);
app.use("/dashboard", router_dashboard);
app.use("/empresa", autenticarToken, router_empresa);
app.use("/config_ia", autenticarToken, router_config_ia);
app.use("/previsao", router_previsao)


app.listen(3000, () => {
    iniciarAgendador();
});