import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import Toast from './components/Toast/Toast';

const AuthContext = createContext();
const ToastContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export function useToast() {
  return useContext(ToastContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    try {
      const decoded = jwtDecode(jwt);
      setUser(decoded);
    } catch (e) {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3500);
  }, []);
  const closeToast = () => setToastOpen(false);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <Toast message={toastOpen ? toast.message : ''} type={toast.type} onClose={closeToast} />
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
} 