"use client";

import { useActionState, useEffect, useRef } from "react";
import { addEquipment } from "@/lib/equipment-actions";

export default function AddEquipmentForm({ rooms, categories }: { rooms: any[], categories: any[] }) {
  const [state, formAction, isPending] = useActionState(addEquipment, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kategoria Sprzętu</label>
        <select name="category_id" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz kategorię...</option>
          {categories.map(c => (
             <option key={c.id} value={c.id}>{c.category_name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lokalizacja (Sala)</label>
        <select name="room_id" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz salę...</option>
          {rooms.map(r => (
             <option key={r.id} value={r.id}>Sala {r.room_number} ({r.building_code})</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Model / Typ / Nazwa</label>
        <input name="model_name" type="text" placeholder="Przykładowy Model X1" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nr Seryjny (Opcjonalnie)</label>
          <input name="serial_number" type="text" placeholder="SN-XXXX" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Data Zakupu (Opcjonalnie)</label>
          <input name="purchase_date" type="date" className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
      </div>

      {state?.error && (
        <div className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-lg flex items-center gap-2">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="text-emerald-400 text-xs font-bold bg-emerald-400/10 border border-emerald-400/20 p-3 rounded-lg flex items-center gap-2">
          {state.success}
        </div>
      )}

      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 mt-4"
      >
        {isPending ? "ZAPISYWANIE..." : "DODAJ DO EWIDENCJI"}
      </button>
    </form>
  );
}
