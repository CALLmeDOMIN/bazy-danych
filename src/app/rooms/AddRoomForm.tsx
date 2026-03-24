"use client";

import { useActionState, useEffect, useRef } from "react";
import { addRoom } from "@/lib/room-actions";

export default function AddRoomForm({ buildings, roomTypes }: { buildings: any[], roomTypes: any[] }) {
  const [state, formAction, isPending] = useActionState(addRoom, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Budynek</label>
        <select name="building_id" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz budynek...</option>
          {buildings.map(b => (
            <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Typ Sali</label>
        <select name="room_type_id" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz typ...</option>
          {roomTypes.map(rt => (
            <option key={rt.id} value={rt.id}>{rt.type_name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Nr Pokoju</label>
          <input name="room_number" type="text" placeholder="Np. 120A" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Pojemność</label>
          <input name="capacity" type="number" min="1" placeholder="Np. 30" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-3 py-2 border-y border-border my-4">
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input name="is_accessible" type="checkbox" value="true" className="w-4 h-4 border border-border rounded bg-secondary text-primary focus:ring-1 focus:ring-primary/50" />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-foreground">Dostępna dla niepełnosprawnych</label>
          </div>
        </div>
      </div>

      {state?.error && (
        <div className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-lg">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="text-emerald-400 text-xs font-bold bg-emerald-400/10 border border-emerald-400/20 p-3 rounded-lg">
          {state.success}
        </div>
      )}

      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
      >
        {isPending ? "DODAWANIE..." : "DODAJ SALĘ"}
      </button>
    </form>
  );
}
