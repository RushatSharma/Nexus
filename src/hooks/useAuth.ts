import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext<AuthContextType | null>(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};