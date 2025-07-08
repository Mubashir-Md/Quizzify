import { supabase, useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AuthSupa() {
  const { session, user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(console.log);
    if (session && user) {
      nav("/admin/profile");
    }
  }, [session, user]);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/admin/profile' }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <Button onClick={loginWithGoogle}>Login with Google</Button>
    </div>
  );
}
