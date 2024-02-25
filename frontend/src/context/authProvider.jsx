import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedUser.exp < currentTime) {
          logout();
        } else {
          setUser(decodedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
      setIsAuthenticated(true);
      localStorage.setItem("jwtToken", token);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
