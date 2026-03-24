"use client";

import { useActionState, useEffect, useRef } from "react";
import { addMaintenanceReport } from "@/lib/maintenance-actions";

export default function AddMaintenanceForm({ rooms, equipment }: { rooms: any[], equipment: any[] }) {
  const [state, formAction, isPending] = useActionState(addMaintenanceReport, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Typ Zgłoszenia</label>
        <select name="report_type" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="broken_equipment">Awaria Sprzętu</option>
          <option value="room_preparation">Przygotowanie Sali</option>
          <option value="other">Inne Zapotrzebowanie</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Priorytet</label>
        <select name="priority" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="low">Niski (Planowy)</option>
          <option value="normal">Normalny</option>
          <option value="high">Wysoki</option>
          <option value="critical">Krytyczny (Blokuje Zajęcia!)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Powiązana Sala (Opcjonalnie)</label>
        <select name="room_id" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz salę...</option>
          {rooms.map(r => (
             <option key={r.id} value={r.id}>Sala {r.room_number} ({r.building_code})</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Powiązany Sprzęt (Opcjonalnie)</label>
        <select name="equipment_id" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz urządzenie...</option>
          {equipment.map(e => (
             <option key={e.id} value={e.id}>{e.model_name} [Sala {e.room_number}]</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Szczegółowy Opis Awarii / Żądania</label>
        <textarea name="description" rows={4} placeholder="Zwięźle opisz problem lub potrzebę..." required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all text-sm custom-scrollbar" />
      </div>

      {state?.error && (
        <div className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-lg">
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
        className="w-full py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20 mt-4"
      >
        {isPending ? "PRZESYŁANIE..." : "WYŚLIJ ZGŁOSZENIE"}
      </button>
    </form>
  );
}
