import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/lib/auth-actions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Politechnika Centralna - CMI",
  description: "Core Management Interface",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="pl">
      <body className={`${inter.variable} ${serif.variable} bg-background text-foreground min-h-screen flex font-sans selection:bg-primary/30 overflow-hidden`}>
        
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-[#020617]/95 border-r border-white/5 flex flex-col z-40 backdrop-blur-xl h-screen sticky top-0">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="group block">
              <h1 className="text-2xl font-serif font-black tracking-tight leading-none mb-1">
                Politechnika<br/><span className="text-primary italic">Centralna</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-black">Core System v4</p>
            </Link>
          </div>

          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2">
            <p className="px-4 text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2 mt-4">Nawigacja Główna</p>
            
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-primary/20 group-hover:text-primary flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11l1 1v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              </div>
              <span className="text-sm font-semibold">Pulpit</span>
            </Link>

            <Link href="/rooms" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <span className="text-sm font-semibold">Sale i Obiekty</span>
            </Link>

            <Link href="/calendar" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              </div>
              <span className="text-sm font-semibold">Kalendarz Rezerwacji</span>
            </Link>

            {session && (
              <Link href="/my-reservations" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
                <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-purple-500/20 group-hover:text-purple-400 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <span className="text-sm font-semibold">Moje Rezerwacje</span>
              </Link>
            )}

            <p className="px-4 text-[10px] uppercase tracking-widest font-black text-slate-600 mb-2 mt-8">Zarządzanie Utrzymaniem</p>
            
            <Link href="/equipment" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-amber-500/20 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
              </div>
              <span className="text-sm font-semibold">Ewidencja Sprzętu</span>
            </Link>

            <Link href="/maintenance" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-all group active:scale-95">
              <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-rose-500/20 group-hover:text-rose-400 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <span className="text-sm font-semibold">Zgłoszenia i Awarie</span>
            </Link>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-white/5 bg-white/[0.02]">
            {session ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20">
                    {session.first_name?.[0] || ''}{session.last_name?.[0] || session.username.substring(0,2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{session.first_name} {session.last_name || session.username}</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{session.role}</p>
                  </div>
                </div>
                <form action={logout} className="w-full">
                  <button className="w-full py-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-xs font-bold uppercase tracking-widest text-slate-400 transition-all">
                    Wyloguj Się
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="flex justify-center py-3 bg-primary hover:bg-primary/90 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20">
                Logowanie do CORE
              </Link>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none"></div>
          
          {/* Top Bar (Mobile / Status) */}
          <header className="h-14 bg-background/50 border-b border-white/5 backdrop-blur-md flex items-center justify-between px-8 z-30">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Operacyjny Online</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              CORE INFRASTRUCTURE UNIT
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12">
            <div className="max-w-[1400px] mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
        
      </body>
    </html>
  );
}
