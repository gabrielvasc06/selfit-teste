import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { changePasswordRequest, loginRequest } from '../services/authService';
import { clearStoredSession, getStoredToken, getStoredUser, setStoredSession } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [passwordChangeSession, setPasswordChangeSession] = useState(null);

  const isAuthenticated = Boolean(token && user);

  const logout = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(null);
    setPasswordChangeSession(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('selfit:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('selfit:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const session = await loginRequest(credentials);

      if (!session.token) {
        throw new Error('Resposta de login sem token JWT.');
      }

      if (session.user.senha_provisoria) {
        setStoredSession(session);
        setToken(session.token);
        setUser(session.user);
        setPasswordChangeSession(session);
        toast.warning('Troca de senha obrigatoria para continuar.');
        return { requiresPasswordChange: true };
      }

      setStoredSession(session);
      setToken(session.token);
      setUser(session.user);
      toast.success('Login realizado com sucesso.');
      return { requiresPasswordChange: false };
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.erro || error.message || 'Falha no login.';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(
    async (payload) => {
      setLoading(true);

      try {
        const session = await changePasswordRequest(payload);
        const nextSession = {
          token: session.token || passwordChangeSession?.token || token,
          user: {
            ...(session.user || passwordChangeSession?.user || user),
            senha_provisoria: false,
          },
        };

        setStoredSession(nextSession);
        setToken(nextSession.token);
        setUser(nextSession.user);
        setPasswordChangeSession(null);
        toast.success('Senha atualizada com sucesso.');
        return nextSession;
      } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.erro || 'Nao foi possivel trocar a senha.';
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [passwordChangeSession, token, user],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated,
      requiresPasswordChange: Boolean(passwordChangeSession),
      login,
      logout,
      changePassword,
    }),
    [changePassword, isAuthenticated, loading, login, logout, passwordChangeSession, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}
