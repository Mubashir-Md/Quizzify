import { supabase } from "@/contexts/AuthContext";
import { motion } from "motion/react"

export default function AuthSupa() {
  // const { session, user } = useAuth();
  // const nav = useNavigate();

  // useEffect(() => {
  //   supabase.auth.getSession().then(console.log);
  //   if (session && user) {
  //     nav("/admin/profile");
  //   }
  // }, [session, user]);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/admin/profile' }
    });
  };

  return (
    <div 
      className="flex justify-center items-center h-screen bg-neutral-900 w-full" 
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(190, 231, 238, 0.2) 0.5px, transparent 0)",
        backgroundSize: "16px 16px",
        backgroundRepeat: "repeat",
        fontFamily: "Orbitron, sans-serif",
    }}>
      <motion.button onClick={loginWithGoogle} 
        whileHover={{
          rotateX: 20,
          rotateY: 10,
          boxShadow: "0px 20px 50px rgba(8, 112, 184, 0.7)"
        }}
        style={{
          translateZ: 100
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.4
        }}
        className="group relative px-12 py-4 bg-black rounded-lg text-neutral-500 shadow-[0px_1px_2px_0px_rgba(255, 255, 255, 0.1), 0px_-1px_2px_0px_rgba(255, 255, 255, 0.1)_inset] cursor-pointer">
        <span className="group-hover:text-cyan-500 transition-colors duration-300">Login with Google</span>
        <span className="absolute inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-px w-3/4 mx-auto"></span>
        <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 inset-x-0 bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent h-[4px] w-full mx-auto blur-sm"></span>
      </motion.button>
    </div>
  );
}
