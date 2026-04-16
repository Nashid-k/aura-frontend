import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../../shared/api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'aura_habit_token';

function setApiToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setApiToken(token);

    async function bootstrap() {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setApiToken(null);
      } finally {
        setReady(true);
      }
    }

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      ready,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      async login(credentials) {
        const { data } = await api.post('/auth/login', credentials);
        localStorage.setItem(TOKEN_KEY, data.token);
        setApiToken(data.token);
        setToken(data.token);
        setUser(data.user);
      },
      async register(payload) {
        const { data } = await api.post('/auth/register', payload);
        localStorage.setItem(TOKEN_KEY, data.token);
        setApiToken(data.token);
        setToken(data.token);
        setUser(data.user);
      },
      async updatePreferences(payload) {
        const { data } = await api.patch('/auth/preferences', payload);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        setApiToken(null);
        setToken(null);
        setUser(null);
      },
    }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
