import sql from "@/db";
import Link from "next/link";

export default async function Home() {
  const [roomsCountResult] = await sql`SELECT COUNT(*) FROM rooms`;
  const [buildingsCount] = await sql`SELECT COUNT(*) FROM buildings`;
  const [profsCountResult] = await sql`SELECT COUNT(*) FROM professors`;
  const [schedulesCountResult] = await sql`SELECT COUNT(*) FROM schedules`;

  const recentRooms = await sql`
    SELECT r.room_number, b.name AS building_name, c.name AS campus_name, rt.type_name
    FROM rooms r 
    JOIN buildings b ON r.building_id = b.id 
    JOIN campuses c ON b.campus_id = c.id
    JOIN room_types rt ON r.room_type_id = rt.id
    ORDER BY r.id DESC LIMIT 5
  `;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl premium-gradient border border-white/5 p-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-5xl font-serif font-black text-white leading-tight">
            Raport <span className="text-primary italic">Infrastruktury</span>
          </h2>
          <p className="text-slate-400 mt-6 text-xl leading-relaxed">
            Centralna baza zasobów dydaktycznych oraz zintegrowany system planowania obciążeń kadr akademickich.
          </p>
          <div className="flex gap-4 mt-8">
             <Link href="/schedules" className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-slate-950 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
               Przeglądaj Harmonogramy
             </Link>
             <Link href="/equipment-analytics" className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all active:scale-95">
               Analiza Sprzętu
             </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Kafle ze statystykami */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-2xl group hover:border-primary/50 transition-all duration-500">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Ewidencja Sal</h3>
          <p className="text-5xl font-serif font-black text-white">{roomsCountResult.count}</p>
          <div className="h-1 w-12 bg-blue-500 mt-6 rounded-full group-hover:w-20 transition-all duration-500"></div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Zarejestrowane obiekty dydaktyczne w {buildingsCount.count} budynkach</p>
        </div>

        <div className="glass-card p-8 rounded-2xl group hover:border-indigo-500/50 transition-all duration-500">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Kadra Akademicka</h3>
          <p className="text-5xl font-serif font-black text-white">{profsCountResult.count}</p>
          <div className="h-1 w-12 bg-indigo-500 mt-6 rounded-full group-hover:w-20 transition-all duration-500"></div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Kwalifikowani pracownicy naukowo-dydaktyczni</p>
        </div>

        <div className="glass-card p-8 rounded-2xl group hover:border-emerald-500/50 transition-all duration-500">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Aktywne Rezerwacje</h3>
          <p className="text-5xl font-serif font-black text-white">{schedulesCountResult.count}</p>
          <div className="h-1 w-12 bg-emerald-500 mt-6 rounded-full group-hover:w-20 transition-all duration-500"></div>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Bieżące moduły lekcyjne w realizacji</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Kolumna boczna - Ostatnie obiekty */}
        <div className="lg:col-span-1 glass-card border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-black text-white text-[10px] uppercase tracking-[0.3em]">Ostatnio dodane sale</h3>
          </div>
          <ul className="divide-y divide-white/5">
            {recentRooms.map((room, idx) => (
              <li key={idx} className="p-8 hover:bg-white/[0.03] transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-primary text-lg group-hover:translate-x-1 transition-transform inline-block">Sala {room.room_number}</span>
                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full font-black uppercase tracking-widest">{room.type_name}</span>
                </div>
                <div className="text-sm">
                   <span className="block text-slate-200 font-bold mb-1">{room.building_name}</span>
                   <span className="block text-slate-500 text-xs italic">{room.campus_name}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <Link href="/schedules" className="flex items-center justify-center gap-2 py-3 w-full bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">
              Pełne zestawienie
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>

        {/* Informacja O Projekcie */}
        <div className="lg:col-span-2 glass-card border-white/10 rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/50 pointer-events-none"></div>
          <h3 className="font-serif text-3xl font-black mb-10 text-white flex items-center gap-4">
            <span className="w-10 h-[1px] bg-primary/30"></span>
            Dokumentacja Systemowa
          </h3>
          <div className="space-y-8">
            <p className="text-slate-300 text-xl leading-relaxed font-medium">
              Zintegrowany ekosystem informatyczny zaprojektowany do precyzyjnego zarządzania mieniem akademickim oraz optymalizacji procesów planowania zasobów Politechniki Centralnej.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-primary">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Wydajność Core</span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed">Przetwarzanie rozproszone z gwarancją integralności danych ACID.</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-indigo-400">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Bezpieczeństwo</span>
                 </div>
                 <p className="text-slate-400 text-sm leading-relaxed">Szyfrowane połączenia kaskadowe z pełnym audytem dostępu.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
