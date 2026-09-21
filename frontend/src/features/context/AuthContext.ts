import { createContext, type Dispatch, type SetStateAction } from 'react';

import type {
  LoginPayload,
  RegisterPayload,
  User,
} from '../../types';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);