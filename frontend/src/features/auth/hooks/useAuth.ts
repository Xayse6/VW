import { useContext } from 'react';

import { APP_ERROR_MESSAGES } from '../../../messages/errors';
import { AuthContext } from '../../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(APP_ERROR_MESSAGES.CONTEXT_MISSING);
  }

  return context;
}
