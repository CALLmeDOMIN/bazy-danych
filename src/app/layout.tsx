import type { Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/lib/auth-actions";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Noto_Serif({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Politechnika Centralna - System Infrastruktury",
  description: "Zarządzanie infrastrukturą akademicką",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="pl">
      <body className={`${inter.variable} ${serif.variable} bg-background text-foreground min-h-screen flex flex-col font-sans selection:bg-primary/30`}>
        {/* Pasek narzędziowy / Top bar */}
        <div className="bg-[#020617]/80 backdrop-blur-md border-b border-white/5 text-slate-400 py-2.5 px-6 text-[11px] flex justify-between items-center z-30 sticky top-0">
          <div className="flex gap-4">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              System Operacyjny: Online
            </span>
          </div>
          <div className="flex gap-6 items-center">
            {session ? (
              <>
                <div className="border-l border-white/10 pl-6 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
                    {session.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-slate-300">
                    Zalogowano: <span className="text-slate-100 font-semibold italic">{session.role} ({session.username})</span>
                  </span>
                </div>
                <form action={logout}>
                  <button className="text-red-400/70 hover:text-red-400 transition-colors bg-red-400/5 hover:bg-red-400/10 px-3 py-1 rounded-md border border-red-400/10">
                    Wyloguj
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">Logowanie</Link>
            )}
          </div>
        </div>

        {/* Główny Header Uczelniany */}
        <header className="bg-slate-950/50 backdrop-blur-xl border-b border-white/5 z-20 sticky top-[41px]">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="group">
                <h1 className="text-3xl font-serif font-black tracking-tight flex items-center gap-2">
                  <span className="text-white">Politechnika</span>
                  <span className="text-primary italic">Centralna</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-[1px] w-8 bg-primary/50 group-hover:w-12 transition-all duration-300"></div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">Core Management Interface</p>
                </div>
              </Link>
            </div>

            {/* Nawigacja Główna */}
            <nav className="hidden lg:flex items-center p-1 bg-white/5 rounded-xl border border-white/5">
              <Link
                href="/"
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95"
              >
                Pulpit
              </Link>
              <Link
                href="/schedules"
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95"
              >
                Harmonogramy
              </Link>
              <Link
                href="/equipment-analytics"
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-95"
              >
                Analiza Zasobów
              </Link>
            </nav>
          </div>
        </header>

        {/* Zawartość */}
        <main className="flex-1 max-w-[1400px] w-full mx-auto p-8 md:p-12 relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          
          {children}
        </main>

        {/* Stopka */}
        <footer className="bg-slate-950 border-t border-white/5 py-12">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-lg font-serif font-bold text-white mb-2">Politechnika Centralna</h4>
              <p className="text-slate-500 text-xs text-center md:text-left">Jednostka certyfikowana ISO-9001. System monitorowania czasu rzeczywistego.</p>
            </div>
            <div className="flex flex-col items-center md:items-end text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">
              <p>© {new Date().getFullYear()} CORE INFRASTRUCTURE UNIT</p>
              <p className="mt-2 text-primary/50">SECURE SHELL v4.2.0-STABLE</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
