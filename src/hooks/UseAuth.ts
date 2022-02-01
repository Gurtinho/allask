import { useContext } from 'react';
import { authContext } from '../contexts/AuthContext';

function UseAuth() {
  const value = useContext(authContext);
  return value;
};

export { UseAuth };