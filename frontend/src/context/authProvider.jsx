import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decodedUser = jwtDecode(token);
            console.log(decodedUser);
            setUser(decodedUser);
        }
    }, []);

    const login = (token) => {
        const decodedUser = jwtDecode(token);
        console.log(decodedUser);
        setUser(decodedUser);
        localStorage.setItem('jwtToken', token);
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
