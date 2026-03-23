"use client";

import { useActionState } from "react";
import { login } from "@/lib/auth-actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      
      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Identyfikator</label>
          <input 
            name="username"
            type="text" 
            placeholder="Nazwa użytkownika"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hasło</label>
          <input 
            name="password"
            type="password" 
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all"
            required
          />
        </div>

        {state?.error && (
          <p className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-lg animate-pulse">
            {state.error}
          </p>
        )}

        <button 
          type="submit"
          disabled={isPending}
          className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-primary/20 mt-4"
        >
          {isPending ? "PRZETWARZANIE..." : "UWIERZYTELNIJ"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
         <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
           System monitorowany przez jednostkę CORE
         </p>
      </div>
    </div>
  );
}
