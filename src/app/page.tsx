
'use client';

import { useSession, signIn, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  const handleSignIn = () => {
    signIn('github');
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        
        {status === "loading" ? (
          <div>Loading...</div>
        ) : session ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="User Avatar" 
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{session.user?.name}</span>
                <span className="text-gray-300">{session.user?.email}</span>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSignIn}
            className="px-4 py-2 bg-[#238636] rounded hover:bg-[#2ea043] transition-colors"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </main>
  );
}
