"use client";

import { useState } from "react";
import { deleteUser } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

export default function DeleteUserModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setIsPending(true);
    setError(null);
    
    const result = await deleteUser(user.id);
    
    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-muted-foreground hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5 hover:border-red-500/30"
        title="Usuń użytkownika"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-red-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          
          <h2 className="text-2xl font-serif font-black text-foreground mb-2">Potwierdź Usunięcie</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Czy na pewno chcesz usunąć użytkownika <span className="font-bold text-foreground">{user.first_name} {user.last_name}</span>?
          </p>

          <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 mb-8 text-left">
            <p className="text-[10px] uppercase font-black tracking-widest text-red-400 mb-2">Konsekwencje:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Wszystkie rezerwacje zostaną usunięte.</li>
              <li>Zgłoszenia techniczne pozostaną jako anonimowe.</li>
              <li>Tej operacji nie można cofnąć.</li>
            </ul>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              disabled={isPending}
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground font-bold text-xs uppercase tracking-widest transition-all"
            >
              Anuluj
            </button>
            <button 
              disabled={isPending}
              onClick={handleDelete}
              className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-500/20"
            >
              {isPending ? "Usuwanie..." : "Usuń Trwale"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
