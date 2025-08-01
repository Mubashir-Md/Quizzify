import { createClient, type Session, type User } from "@supabase/supabase-js";
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
  useContext,
} from "react";
import { useTheme } from "./ThemeContext";

interface AuthContextType {
  user: User | null;
  session: Session | null;
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const {isDarkMode} = useTheme()

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error restoring session", error);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    restoreSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className={`text-white h-screen flex items-center justify-center text-center text-8xl text-bold ${isDarkMode ? "bg-black text-yellow-300" : "bg-white text-yellow-500"}`}>
        Loading...
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
