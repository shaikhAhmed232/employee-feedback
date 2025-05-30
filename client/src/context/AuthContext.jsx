import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated, isAdmin, logout } from '../services/authService';

// Create Auth Context
const AuthContext = createContext(null);

// Context Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuthState = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        // If there's an error, clear any potentially corrupted data
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    initAuthState();
  }, []);
  
  // Update user in context after login/register
  const updateUser = (userData) => {
    setUser(userData);
  };
  
  // Handle user logout
  const handleLogout = () => {
    logout();
    setUser(null);
  };
  
  // Check if user is admin
  const checkIsAdmin = () => {
    return user?.role === 'admin' || false;
  };
  
  const value = {
    user,
    updateUser,
    isAuthenticated: !!user,
    checkIsAdmin: checkIsAdmin(),
    handleLogout,
    loading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;