import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, getMe } from "../api/admin";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("smartspend_admin_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        if (res.data.user.role !== 1) throw new Error("Not an admin account");
        setAdmin(res.data.user);
      } catch {
        localStorage.removeItem("smartspend_admin_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
   
  }, []);

  
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    if (res.data.user.role !== 1) {
      throw { response: { data: { message: "This account doesn't have admin access." } } };
    }
    localStorage.setItem("smartspend_admin_token", res.data.token);
    setToken(res.data.token);
    setAdmin(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("smartspend_admin_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
