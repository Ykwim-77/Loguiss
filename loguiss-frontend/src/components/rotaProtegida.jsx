import { Navigate, Outlet } from 'react-router-dom';

function tokenValido(token) {
  if (!token || token === 'null' || token === 'undefined') {
    return false;
  }

  const partes = token.split('.');
  if (partes.length === 3) {
    try {
      const payload = JSON.parse(atob(partes[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
}

export function RotaProtegida({ redirecionarPara = '/login' }) {
  const token = localStorage.getItem('token');

  if (!tokenValido(token)) {
    localStorage.removeItem('token');
    return <Navigate to={redirecionarPara} replace />;
  }

  return <Outlet />;
}