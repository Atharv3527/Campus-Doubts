// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api, { googleLoginApi } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("campus_user");
    if (!stored) {
      setAuthReady(true);
      return;
    }

    try {
      setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("campus_user");
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data);
    localStorage.setItem("campus_user", JSON.stringify(data));
  };

  const googleLogin = async (credential) => {
    const { data } = await googleLoginApi(credential);
    setUser(data);
    localStorage.setItem("campus_user", JSON.stringify(data));
  };

  const updateProfile = async (formData) => {
    const { data } = await api.put("/auth/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updatedUser = { ...user, ...data };

    setUser(updatedUser);
    localStorage.setItem("campus_user", JSON.stringify(updatedUser));

    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campus_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        updateProfile,
        logout,
        authReady,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
