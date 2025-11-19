// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load current user on refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me/");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Small delay to allow HttpOnly cookies to save before calling /me
  const waitForCookies = () =>
    new Promise((resolve) => setTimeout(resolve, 120));

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  const login = async (email, password) => {
    await api.post("/auth/login/", { email, password });

    await waitForCookies();

    const res = await api.get("/auth/me/");
    setUser(res.data);

    if (res.data.is_staff) navigate("/admin/dashboard");
    else navigate("/");
  };

  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------
  const register = async (fullName, email, password) => {
    const [first_name, ...rest] = fullName.trim().split(" ");
    const last_name = rest.join(" ");

    await api.post("/auth/register/", {
      first_name,
      last_name,
      email,
      password,
    });

    await waitForCookies();

    const res = await api.get("/auth/me/");
    setUser(res.data);

    navigate("/");
  };

  // ---------------------------------------------------------
  // GOOGLE LOGIN
  // ---------------------------------------------------------
  const googleLogin = async (credential) => {
    await api.post("/auth/google/", { id_token: credential });

    await waitForCookies();

    const res = await api.get("/auth/me/");
    setUser(res.data);

    if (res.data.is_staff) navigate("/admin/dashboard");
    else navigate("/");
  };

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  const logout = async () => {
    try {
      await api.post("/auth/logout/");
    } catch {}
    setUser(null);
    navigate("/login");
  };

  const isAdmin = Boolean(user?.is_staff);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
