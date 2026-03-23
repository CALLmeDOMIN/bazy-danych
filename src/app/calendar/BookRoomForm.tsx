"use client";

import { useActionState, useEffect, useRef } from "react";
import { addBooking } from "@/lib/booking-actions";

export default function BookRoomForm({ rooms }: { rooms: any[] }) {
  const [state, formAction, isPending] = useActionState(addBooking, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sala do rezerwacji</label>
        <select name="room_id" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
          <option value="">Wybierz salę...</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              Sala {room.room_number} ({room.building_name}) - Poj. {room.capacity}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tytuł Zdarzenia</label>
        <input name="title" type="text" placeholder="Wprowadź cel rezerwacji..." required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Data Rezerwacji</label>
        <input name="reserved_date" type="date" min={today} required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rozpoczęcie</label>
          <input name="start_time" type="time" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Zakończenie</label>
          <input name="end_time" type="time" required className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-primary/50 transition-all text-sm" />
        </div>
      </div>

      {state?.error && (
        <div className="text-red-400 text-xs font-bold bg-red-400/10 border border-red-400/20 p-3 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="text-emerald-400 text-xs font-bold bg-emerald-400/10 border border-emerald-400/20 p-3 rounded-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {state.success}
        </div>
      )}

      <button 
        type="submit"
        disabled={isPending}
        className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 mt-4"
      >
        {isPending ? "PRZETWARZANIE..." : "ZAREZERWUJ SALĘ"}
      </button>

      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black text-center mt-4">
        System automatycznie upewni się o braku kolizji terminów.
      </p>
    </form>
  );
}
