import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

//telas
import Login from './pages/login'
import EsqueceuSenha from './pages/esqueceu-senha';
import CodigoVerificacao from './pages/codigo-verificacao';
import RedefinirSenha from './pages/redefinir-senha';
import Termos from './pages/termos';
import Politicas from './pages/politicas';
import Home from './pages/home';
import Produtos from './pages/produtos';
import UnidadesMedida from './pages/unidades-medida';
import Categorias from './pages/categorias';
import Usuarios from './pages/usuarios';
import Fornecedor from './pages/fornecedor';


function App() {
  return (
    <>

      <Toaster position="top-right" />

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

          <Route path="/codigo-verificacao" element={<CodigoVerificacao />} />

          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          <Route path="/termos" element={<Termos />} />

          <Route path="/politicas" element={<Politicas />} />

          <Route path="/home" element={<Home />} />

          <Route path="/produtos" element={<Produtos />} />

          <Route path="/unidades-medida" element={<UnidadesMedida />} />

          <Route path="/categorias" element={<Categorias />} />

          <Route path="/usuarios" element={<Usuarios />} />

          <Route path="/fornecedores" element={<Fornecedor />} />

        </Routes>

      </BrowserRouter>

    </>

  );

}

export default App;