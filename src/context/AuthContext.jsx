import { createContext, useState, useEffect, useContext } from 'react';
import { registerUser, loginUser, getMe } from '../api/auth';
import ClipLoader from "react-spinners/ClipLoader";

export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await getMe(); 
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Token validation failed, logging out.", error);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []); 

  const registerAction = async (userData) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      const { token, ...userDataWithoutToken } = data;
      setUser(userDataWithoutToken);
      return data;
    } catch (error) {
        throw error;
    }
  };

const loginAction = async (credentials) => {
    try {
      console.log("3. loginAction in context called with:", credentials);
      const data = await loginUser(credentials);
      
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      const { token, ...userDataWithoutToken } = data;
      setUser(userDataWithoutToken);
      
      return data;
    } catch (error) {
        console.error("Error inside loginAction:", error);
        throw error;
    }
};

  const logOut = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader color={"#3b82f6"} size={50} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, registerAction, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};