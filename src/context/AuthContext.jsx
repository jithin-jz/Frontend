import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load saved auth info on startup -------------------------
  useEffect(() => {
    const access = localStorage.getItem("access");
    const storedUser = localStorage.getItem("user");

    if (access && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // Save tokens + user --------------------------------------
  const saveAuth = (tokens, userInfo) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userInfo));

    setUser(userInfo);
  };

  // Helper for redirect AFTER state updates -----------------
  const redirectAfterAuth = (isAdmin) => {
    setTimeout(() => {
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }, 50); // KEY FIX
  };

  // LOGIN ----------------------------------------------------
  const login = async (email, password) => {
    const res = await authApi.login(email, password);

    const userInfo = res.data.user;
    const tokens = res.data.tokens;

    saveAuth(tokens, userInfo);
    redirectAfterAuth(userInfo.is_staff);

    return userInfo;
  };

  // REGISTER -------------------------------------------------
  const register = async (fullName, email, password) => {
    const [first_name, ...rest] = fullName.split(" ");
    const last_name = rest.join(" ") || "";

    const res = await authApi.register(first_name, last_name, email, password);

    const userInfo = res.data.user;
    const tokens = res.data.tokens;

    saveAuth(tokens, userInfo);
    redirectAfterAuth(false);

    return userInfo;
  };

  // GOOGLE LOGIN --------------------------------------------
  const googleLogin = async (credential) => {
    const res = await authApi.googleLogin(credential);

    const userInfo = res.data.user;
    const tokens = res.data.tokens;

    saveAuth(tokens, userInfo);
    redirectAfterAuth(userInfo.is_staff);

    return userInfo;
  };

  // LOGOUT ---------------------------------------------------
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  // Computed admin flag -------------------------------------
  const isAdmin = user?.is_staff === true;

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
