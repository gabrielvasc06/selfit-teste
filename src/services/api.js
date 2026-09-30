import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';
const AUTH_TOKEN_KEY = 'selfit.auth.token';
const AUTH_USER_KEY = 'selfit.auth.user';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredSession({ token, user }) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function clearStoredSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearStoredSession();
      window.dispatchEvent(new Event('selfit:unauthorized'));

      if (window.location.pathname !== '/login') {
        toast.error('Sessao expirada. Entre novamente.');
        window.location.replace('/login');
      }
    } else if (status === 403) {
      toast.warning('Acesso negado para esta operacao.');
    } else if (!error.response) {
      toast.error('Nao foi possivel conectar ao servidor. Verifique a API.');
    } else if (status >= 500) {
      toast.error('Instabilidade no servidor. Tente novamente em instantes.');
    }

    return Promise.reject(error);
  },
);

export default api;
