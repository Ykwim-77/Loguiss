// Erro com status HTTP e um código curto para o front identificar o problema.
export function erroHttp(status, mensagem, codigo) {
  const erro = new Error(mensagem);
  erro.status = status;
  erro.codigo = codigo;
  return erro;
}

export default { erroHttp };