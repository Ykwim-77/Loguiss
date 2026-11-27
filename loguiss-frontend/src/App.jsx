import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { RotaProtegida } from './components/rotaProtegida';
import Categorias from './pages/categorias';
import Clientes from './pages/clientes';
import CodigoVerificacao from './pages/codigo-verificacao';
import Configuracoes from './pages/configuracoes';
import ConfiguracoesIA from './pages/configuracoes-ia';
import Dashboard from './pages/dashboard';
import EsqueceuSenha from './pages/esqueceu-senha';
import Fornecedor from './pages/fornecedor';
//telas
import Login from './pages/login';
import MovimentacaoEntrada from './pages/movimentacao-entrada';
import MovimentacaoSaida from './pages/movimentacao-saida';
import Politicas from './pages/politicas';
import PrevisaoDemandas from './pages/previsao-demanda';
import Producao from './pages/producao';
import Produtos from './pages/produtos';
import RedefinirSenha from './pages/redefinir-senha';
import Termos from './pages/termos';
import UnidadesMedida from './pages/unidades-medida';
import Usuarios from './pages/usuarios';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
          <Route path="/codigo-verificacao" element={<CodigoVerificacao />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/politicas" element={<Politicas />} />

          {/* Rotas protegidas (exigem token JWT válido no localStorage) */}
          <Route element={<RotaProtegida redirecionarPara="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/unidades-medida" element={<UnidadesMedida />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/fornecedores" element={<Fornecedor />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/movimentacao-saida" element={<MovimentacaoSaida />} />
            <Route path="/movimentacao-entrada" element={<MovimentacaoEntrada />} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/configuracoes-ia" element={<ConfiguracoesIA />} />
            <Route path="/previsao-demanda" element={<PrevisaoDemandas />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
