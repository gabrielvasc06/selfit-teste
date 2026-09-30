import api from './api';

export async function loginRequest(credentials) {
  const payload = {
    usuario: credentials.usuario.trim().toUpperCase(),
    senha: credentials.senha,
  };

  const { data } = await api.post('/auth/login', payload);
  return normalizeAuthResponse(data);
}

export async function changePasswordRequest({ senhaAtual, novaSenha }) {
  const { data } = await api.post('/auth/trocar-senha', {
    senha_atual: senhaAtual,
    nova_senha: novaSenha,
  });

  return normalizeAuthResponse(data);
}

function normalizeAuthResponse(data) {
  const token = data?.token || data?.accessToken || data?.jwt;
  const user = data?.usuario || data?.user || {};

  return {
    token,
    user: {
      id: user.id,
      usuario: user.usuario || user.login || '',
      nome: user.nome || user.usuario || user.login || 'USUARIO',
      perfil: user.perfil || user.role || 'Administrador',
      senha_provisoria: Boolean(user.senha_provisoria ?? data?.senha_provisoria),
    },
  };
}
