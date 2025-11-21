import { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getMe } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Fetch user data with the token
          const userData = await getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          // invalid or expired
          console.error("Token validation failed", error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []); 

  const registerAction = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const loginAction = async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ token, user, registerAction, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};