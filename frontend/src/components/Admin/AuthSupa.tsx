import { createClient, type Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function AuthSupa() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    console.log(session);

    return () => subscription.unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173/admin/createQuiz' // or your hosted URL
      }
    })
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <button
          onClick={loginWithGoogle}
          className="bg-blue-500 text-white px-6 py-3 rounded cursor-pointer"
        >
          Login with Google
        </button>
      </div>
    )
  }

}
