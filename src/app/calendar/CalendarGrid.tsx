"use client";

import { useState, useMemo } from "react";
import BookingModal from "./BookingModal";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 08:00 - 21:00
const DAYS = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

export default function CalendarGrid({ bookings, rooms }: { bookings: any[], rooms: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string, time: string } | undefined>();

  // Get start of the current week (Monday)
  const weekStart = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }, [currentDate]);

  // Generate array of 7 dates for the current week
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const changeWeek = (offset: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset * 7);
    setCurrentDate(d);
  };

  const handleSlotClick = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    setSelectedSlot({ date: dateStr, time: timeStr });
    setIsModalOpen(true);
  };

  // Filter and position bookings for the current week
  const weekBookings = useMemo(() => {
    const startStr = weekDates[0].toISOString().split('T')[0];
    const endStr = weekDates[6].toISOString().split('T')[0];

    return bookings.filter(b => {
      const bDate = new Date(b.reserved_date).toISOString().split('T')[0];
      return bDate >= startStr && bDate <= endStr;
    }).map(b => {
      const bDate = new Date(b.reserved_date);
      const dayIdx = (bDate.getDay() + 6) % 7; // Monday = 0
      
      const [h, m] = b.start_time.split(':').map(Number);
      const [eh, em] = b.end_time.split(':').map(Number);
      
      const startMinutes = h * 60 + m;
      const endMinutes = eh * 60 + em;
      const duration = endMinutes - startMinutes;
      
      // Calculate top position relative to 08:00
      const gridStartMinutes = 8 * 60;
      const top = ((startMinutes - gridStartMinutes) / 60) * 100; // 100px per hour
      const height = (duration / 60) * 100;

      return { ...b, dayIdx, top, height };
    });
  }, [bookings, weekDates]);

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-white min-w-[200px]">
            {weekDates[0].toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex bg-slate-900 rounded-xl p-1 border border-white/5">
            <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Dzisiaj</button>
            <button onClick={() => changeWeek(1)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        <button 
          onClick={() => { setSelectedSlot(undefined); setIsModalOpen(true); }}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Nowe spotkanie
        </button>
      </div>

      {/* Grid */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden flex flex-col bg-slate-950/20">
        
        {/* Days Header */}
        <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-white/5">
          <div className="p-4 border-r border-white/5"></div>
          {weekDates.map((date, i) => (
            <div key={i} className={`p-4 text-center border-r border-white/5 last:border-0 ${date.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{DAYS[i].substring(0, 3)}</p>
              <p className={`text-xl font-serif font-black ${date.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-white'}`}>
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="relative overflow-y-auto max-h-[700px] custom-scrollbar">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] relative">
            
            {/* Time labels axis */}
            <div className="border-r border-white/5 bg-slate-950/40">
              {HOURS.map(hour => (
                <div key={hour} className="h-[100px] p-2 text-right">
                  <span className="text-[10px] font-black text-slate-600 tabular-nums">{hour}:00</span>
                </div>
              ))}
            </div>

            {/* Grid cells */}
            {weekDates.map((date, dIdx) => (
              <div key={dIdx} className="relative border-r border-white/5 last:border-0 group">
                {HOURS.map(hour => (
                  <div 
                    key={hour} 
                    className="h-[100px] border-b border-white/[0.03] last:border-0 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => handleSlotClick(date, hour)}
                  ></div>
                ))}
              </div>
            ))}

            {/* Bookings Overlay */}
            <div className="absolute top-0 left-[80px] right-0 h-full pointer-events-none">
              <div className="grid grid-cols-7 h-full">
                {Array.from({ length: 7 }).map((_, dIdx) => (
                  <div key={dIdx} className="relative h-full">
                    {weekBookings.filter(b => b.dayIdx === dIdx).map(b => (
                      <div 
                        key={b.id}
                        className="absolute left-2 right-2 rounded-xl p-3 border shadow-2xl pointer-events-auto cursor-pointer group/event transition-all hover:z-20 hover:scale-[1.02]"
                        style={{ 
                          top: `${b.top}px`, 
                          height: `${b.height}px`,
                          backgroundColor: b.booking_type === 'class' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          borderColor: b.booking_type === 'class' ? 'rgba(129, 140, 248, 0.3)' : 'rgba(52, 211, 153, 0.3)',
                        }}
                        title={`${b.title} (${b.start_time} - ${b.end_time})`}
                      >
                         <div className={`absolute left-0 top-0 h-full w-1 rounded-full ${b.booking_type === 'class' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 truncate">
                           {b.start_time.substring(0,5)} - {b.end_time.substring(0,5)}
                         </p>
                         <h5 className="text-[11px] font-bold text-white line-clamp-2 leading-tight group-hover/event:text-primary transition-colors">{b.title}</h5>
                         {b.room_number && (
                           <p className="text-[9px] text-slate-500 mt-2 font-black uppercase tracking-tighter">Sala {b.room_number}</p>
                         )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        rooms={rooms}
        initialData={selectedSlot}
      />

    </div>
  );
}
