import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
};

export interface IAuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const defaultAuthState = { user: null, isLoggedIn: false };

const authContext = createContext<IAuthState>(defaultAuthState);
const dispatchContext = createContext((() => {}) as Dispatch<SetStateAction<IAuthState>>);

export const AuthProvider: React.FC<{ defaultValue?: any }> = ({
  children,
  defaultValue = defaultAuthState,
}) => {
  const [auth, setAuth] = useState<IAuthState>(defaultValue);

  return (
    <authContext.Provider value={auth}>
      <dispatchContext.Provider value={setAuth}>{children}</dispatchContext.Provider>
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export const useAuthDispatch = () => useContext(dispatchContext);
