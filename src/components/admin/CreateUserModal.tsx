"use client";

import { useActionState, useEffect, useState } from "react";
import { createUser } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

export default function CreateUserModal({ departments }: { departments: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(createUser, undefined);
  const router = useRouter();

  // Zwijanie modalu po sukcesie
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      router.refresh(); // Odśwież widok z nowymi danymi
    }
  }, [state, router]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider shadow-lg transition-transform active:scale-95"
      >
        + Dodaj Użytkownika
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
          <div className="p-6 border-b border-white/5 bg-secondary/30 flex justify-between items-center">
            <h2 className="text-xl font-serif font-black text-foreground">Kreator Użytkownika</h2>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
          </div>

          <form action={action} className="p-6 space-y-4">
            
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium">
                {state.error}
              </div>
            )}
            
            {state?.success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm font-medium">
                {state.success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Imię</label>
                <input type="text" name="first_name" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nazwisko</label>
                <input type="text" name="last_name" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</label>
              <input type="email" name="email" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nazwa Użytkownika (Login)</label>
                <input type="text" name="username" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
                </div>
                <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hasło Logowania</label>
                <input type="password" name="password" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rola</label>
                <select name="role" required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="student">Student</option>
                  <option value="professor">Wykładowca (Professor)</option>
                  <option value="staff">Obsługa (Staff)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Wydział / Katedra</label>
                <select name="department_id" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 appearance-none">
                  <option value="">Brak (Dla admin/staff/student)</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <p className="text-[10px] text-amber-500/80 mb-4 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                Informacja: Baza danych posiada trigger zapobiegający dołączaniu administratora do Katedry. Upewnij się, że poprawnie mapujesz te dane!
            </p>

            <button disabled={isPending} type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-500/20">
              {isPending ? "Zapisywanie..." : "Utwórz Konto"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
