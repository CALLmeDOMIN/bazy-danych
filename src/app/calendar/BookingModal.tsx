"use client";

import { useState } from "react";
import { addBooking } from "@/lib/booking-actions";
import { useActionState, useEffect } from "react";

export default function BookingModal({ 
  isOpen, 
  onClose, 
  rooms, 
  initialData 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  rooms: any[]; 
  initialData?: { date: string; time: string } 
}) {
  const [state, formAction, isPending] = useActionState(addBooking, null);

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  }, [state?.success, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-lg p-8 rounded-3xl border border-border shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="text-2xl font-serif font-black text-foreground mb-8">
          Nowa <span className="text-primary italic">Rezerwacja</span>
        </h3>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Wybierz Salę</label>
            <select name="room_id" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none">
              <option value="">Wybierz...</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.room_number} ({room.building_name})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Tytuł Zdarzenia</label>
            <input name="title" type="text" placeholder="Np. Wykład z Baz Danych" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Data</label>
            <input name="reserved_date" type="date" defaultValue={initialData?.date} required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Od</label>
              <input name="start_time" type="time" defaultValue={initialData?.time} required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Do</label>
              <input name="end_time" type="time" required className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm" />
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

          <div className="pt-4 flex gap-3">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-all border border-border text-xs uppercase tracking-widest"
             >
               Anuluj
             </button>
             <button 
               type="submit"
               disabled={isPending}
               className="flex-1 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-slate-950 font-black rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
             >
               {isPending ? "Moment..." : "Potwierdź"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
