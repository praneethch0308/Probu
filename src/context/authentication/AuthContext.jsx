import { useContext } from 'react';
import { AuthContext } from './AuthState';

export const useAuth = () => {
  return useContext(AuthContext);
};