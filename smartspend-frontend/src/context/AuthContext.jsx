import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getMe } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("smartspend_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data.user);
      } catch {
        localStorage.removeItem("smartspend_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
    
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem("smartspend_token", res.data.token);
    localStorage.setItem("smartspend_user", JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    localStorage.setItem("smartspend_token", res.data.token);
    localStorage.setItem("smartspend_user", JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("smartspend_token");
    localStorage.removeItem("smartspend_user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 1;

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
