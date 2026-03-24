import sql from "@/db";
import AddRoomForm from "./AddRoomForm";

export default async function RoomsPage() {
  const rooms = await sql`
    SELECT 
      r.id, r.room_number, r.capacity, r.is_accessible, r.status,
      b.name as building_name, b.code as building_code,
      c.name as campus_name,
      rt.type_name as room_type,
      string_agg(ec.category_name || ': ' || e.model_name, ', ') as equipment_list
    FROM rooms r
    JOIN buildings b ON r.building_id = b.id
    JOIN campuses c ON b.campus_id = c.id
    JOIN room_types rt ON r.room_type_id = rt.id
    LEFT JOIN equipment e ON r.id = e.room_id
    LEFT JOIN equipment_categories ec ON e.category_id = ec.id
    GROUP BY r.id, b.id, c.id, rt.id
    ORDER BY c.name, b.name, r.room_number
  `;

  const buildings = await sql`SELECT id, name, code, campus_id FROM buildings ORDER BY name`;
  const roomTypes = await sql`SELECT id, type_name FROM room_types ORDER BY type_name`;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-foreground">
            Sale i <span className="text-primary italic">Obiekty</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest font-black">
            Baza zasobów dydaktycznych
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Formularz Dodawania Sali (1 kolumna) */}
        <div className="xl:col-span-1 glass-card p-8 rounded-3xl border border-border relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full"></div>
           <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
             <div className="w-2 h-6 bg-primary rounded-full"></div>
             Dodaj Nową Salę
           </h3>
           <AddRoomForm buildings={buildings} roomTypes={roomTypes} />
        </div>

        {/* Lista Sal (2 kolumny) */}
        <div className="xl:col-span-2 glass-card p-1 rounded-3xl border border-border relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/30 blur-[80px] rounded-full pointer-events-none"></div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-border text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                   <th className="p-6">Numer / Budynek</th>
                   <th className="p-6">Typ / Wyposażenie</th>
                   <th className="p-6 text-center">Pojemność</th>
                   <th className="p-6 text-center">Dostęp</th>
                   <th className="p-6 text-right">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border text-sm">
                 {rooms.map((room: any) => (
                   <tr key={room.id} className="hover:bg-secondary/40 transition-colors group">
                     <td className="p-6">
                       <span className="block font-bold text-foreground group-hover:text-primary transition-colors">
                         {room.room_number} <span className="text-muted-foreground font-normal">({room.building_code})</span>
                       </span>
                       <span className="block text-xs text-muted-foreground mt-1">{room.building_name}</span>
                     </td>
                     <td className="p-6">
                        <span className="block text-foreground font-medium">{room.room_type}</span>
                        <span className="block text-[10px] text-muted-foreground mt-1 italic max-w-[200px] truncate" title={room.equipment_list}>
                          {room.equipment_list || 'Brak wyposażenia'}
                        </span>
                      </td>
                     <td className="p-6 text-center text-foreground font-bold">{room.capacity}</td>
                     <td className="p-6 text-center flex justify-center mt-4">
                       {room.is_accessible ? (
                         <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20" title="Dostępna dla niepełnosprawnych">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         </div>
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20" title="Brak dostępu dla niepełnosprawnych">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                         </div>
                       )}
                     </td>
                     <td className="p-6 text-right">
                       <span className={`text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border ${
                         room.status === 'available' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                         room.status === 'under_maintenance' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                         'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                       }`}>
                         {room.status === 'available' ? 'DOSTĘPNA' : room.status === 'under_maintenance' ? 'SERWIS' : 'ZAMKNIĘTA'}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}
