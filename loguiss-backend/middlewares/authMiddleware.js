import jwt from 'jsonwebtoken';
import { erroHttp } from '../utils/erros.js';

const JWT_SECRET = process.env.CHAVE_JWT;

export function autenticarToken(req, res, next) {
  try {
    if (!JWT_SECRET) {
      return next(
        erroHttp(
          500,
          'Chave secreta JWT não configurada no servidor.',
          'JWT_SEM_SEGREDO'
        )
      );
    }

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || typeof authHeader !== 'string') {
      return next(
        erroHttp(
          401,
          'Token de autenticação não informado no header Authorization.',
          'TOKEN_AUSENTE'
        )
      );
    }

    const partes = authHeader.trim().split(/\s+/);
    if (partes.length !== 2 || partes[0].toLowerCase() !== 'bearer' || !partes[1]) {
      return next(
        erroHttp(
          401,
          'Formato inválido do header Authorization. Use: Bearer <token>.',
          'TOKEN_FORMATO_INVALIDO'
        )
      );
    }

    const token = partes[1];
    const payload = jwt.verify(token, JWT_SECRET);


    req.usuario = payload;
    req.user = payload;

    return next();
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      return next(
        erroHttp(401, 'Token expirado. Faça login novamente.', 'TOKEN_EXPIRADO')
      );
    }

    if (error?.name === 'JsonWebTokenError' || error?.name === 'NotBeforeError') {
      return next(
        erroHttp(401, 'Token inválido.', 'TOKEN_INVALIDO')
      );
    }

    return next(error);
  }
}

export default autenticarToken;