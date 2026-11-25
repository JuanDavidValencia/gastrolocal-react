import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const auth = useContext(AuthContext);
  if (auth === null) {
    throw new Error("useAuth requiere AuthProvider.");
  }
  return auth;
}
