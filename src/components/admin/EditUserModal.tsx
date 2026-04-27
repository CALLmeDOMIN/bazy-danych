"use client";

import { useActionState, useEffect, useState } from "react";
import { updateUser } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

export default function EditUserModal({ user, departments }: { user: any; departments: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, isPending] = useActionState(updateUser, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
      router.refresh();
    }
  }, [state, router]);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted-foreground hover:text-indigo-400 transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/30"
        title="Edytuj użytkownika"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] relative">
          <div className="p-6 border-b border-white/5 bg-secondary/30 flex justify-between items-center">
            <h2 className="text-xl font-serif font-black text-foreground">Edycja Użytkownika</h2>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
          </div>

          <form action={action} className="p-6 space-y-4">
            <input type="hidden" name="id" value={user.id} />
            
            {state?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Imię</label>
                <input type="text" name="first_name" defaultValue={user.first_name} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nazwisko</label>
                <input type="text" name="last_name" defaultValue={user.last_name} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email</label>
              <input type="email" name="email" defaultValue={user.email} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Nazwa Użytkownika</label>
                <input type="text" name="username" defaultValue={user.username} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Rola</label>
                <select name="role" defaultValue={user.role} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50 appearance-none">
                  <option value="student">Student</option>
                  <option value="professor">Wykładowca</option>
                  <option value="staff">Obsługa</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Katedra</label>
                <select name="department_id" defaultValue={user.department_id || ""} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500/50 appearance-none">
                  <option value="">Brak</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl border border-white/5">
                <input 
                    type="checkbox" 
                    name="is_active" 
                    id={`active-${user.id}`}
                    defaultChecked={user.is_active}
                    className="w-4 h-4 rounded border-white/10 bg-black/40 text-indigo-500 focus:ring-indigo-500/50" 
                />
                <label htmlFor={`active-${user.id}`} className="text-sm font-bold text-foreground cursor-pointer">Konto Aktywne</label>
            </div>

            <button disabled={isPending} type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-indigo-500/20">
              {isPending ? "Zapisywanie..." : "Zapisz Zmiany"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
