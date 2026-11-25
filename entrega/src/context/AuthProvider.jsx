import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { AuthContext } from "./useAuth.js";

export function AuthProvider({ children }) {
  // undefined indica que Supabase todavía está restaurando la sesión.
  const [sesion, setSesion] = useState(supabase ? undefined : null);

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        const user = nuevaSesion?.user;
        setSesion(user ? { user: { id: user.id, email: user.email, user_metadata: user.user_metadata } } : null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function entrar() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/acceso" },
    });
    if (error) throw error;
  }

  async function salir() {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
  }

  return (
    <AuthContext.Provider value={{ sesion, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}
