"use client";

import { resolveReport } from "@/lib/maintenance-actions";
import { useState } from "react";

export default function ResolveButton({ id }: { id: number }) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async () => {
    if (confirm("Potwierdzasz rozwiązanie problemu/awarii? Skutkować to będzie przywróceniem dostępności sprzętu.")) {
      setIsResolving(true);
      await resolveReport(id);
      setIsResolving(false);
    }
  };

  return (
    <button 
      onClick={handleResolve} 
      disabled={isResolving}
      className="text-[10px] px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-md shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 mt-1"
    >
      {isResolving ? "ZAMYKANIE..." : "ZAMKNIJ TIKET"}
    </button>
  );
}
