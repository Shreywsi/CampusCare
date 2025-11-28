import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

function parseToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = parseToken(token);
      if (payload) {
        setUser({ id: payload.id || payload._id, role: payload.role, email: payload.email });
      } else {
        localStorage.removeItem("token");
      }
    }
    setReady(true);
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { token, role } = res.data;
    localStorage.setItem("token", token);
    const payload = parseToken(token);
    setUser({ id: payload.id || payload._id, role: role || payload.role, email });
    return res.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  async function register(payload) {
    // payload: { name, email, password, role }
    return api.post("/auth/register", payload);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}