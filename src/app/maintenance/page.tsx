import sql from "@/db";
import AddMaintenanceForm from "./AddMaintenanceForm";
import ResolveButton from "./ResolveButton";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function MaintenancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isStaff = session.role === 'admin' || session.role === 'staff';

  const reports = await sql`
    SELECT 
      m.id, m.report_type, m.description, m.priority, m.status, m.created_at, m.resolved_at,
      u.first_name, u.last_name, u.username,
      res.first_name as res_first, res.last_name as res_last, res.username as res_user,
      r.room_number, b.code as building_code,
      e.model_name, e.serial_number
    FROM maintenance_reports m
    LEFT JOIN users u ON m.reported_by = u.id
    LEFT JOIN users res ON m.resolved_by = res.id
    LEFT JOIN rooms r ON m.room_id = r.id
    LEFT JOIN buildings b ON r.building_id = b.id
    LEFT JOIN equipment e ON m.equipment_id = e.id
    ORDER BY 
       CASE WHEN m.status = 'open' THEN 1 WHEN m.status = 'in_progress' THEN 2 ELSE 3 END,
       m.created_at DESC
  `;

  const rooms = await sql`
    SELECT r.id, r.room_number, b.code as building_code 
    FROM rooms r JOIN buildings b ON r.building_id = b.id 
    ORDER BY b.code, r.room_number
  `;
  const equipment = await sql`
    SELECT e.id, e.model_name, e.serial_number, r.room_number 
    FROM equipment e JOIN rooms r ON e.room_id = r.id
    WHERE e.status != 'retired'
    ORDER BY e.model_name
  `;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-white">
            Zgłoszenia <span className="text-primary italic">Awarii</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-black">
            Nadzór Infrastruktury i Utrzymanie Ruchu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        <div className="xl:col-span-1 glass-card p-8 rounded-3xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 blur-[50px] rounded-full pointer-events-none"></div>
           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
             <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
             Nowy Bilet Złoszeniowy
           </h3>
           <AddMaintenanceForm rooms={rooms} equipment={equipment} />
        </div>

        <div className="xl:col-span-2 glass-card p-1 rounded-3xl border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-slate-500/10 blur-[80px] rounded-full pointer-events-none"></div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                   <th className="p-6">Zgłoszenie</th>
                   <th className="p-6">Cel / Lokalizacja</th>
                   <th className="p-6">Informacje</th>
                   <th className="p-6 text-right">Zarządzanie</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                 {reports.map(rep => {
                   const dateStr = new Date(rep.created_at).toLocaleDateString();
                   const isResolved = rep.status === 'resolved' || rep.status === 'rejected';

                   return (
                     <tr key={rep.id} className={`hover:bg-white/[0.02] transition-colors group ${isResolved ? 'opacity-60' : ''}`}>
                       <td className="p-6">
                         <span className="block font-bold text-white group-hover:text-rose-400 transition-colors uppercase tracking-widest text-[10px]">
                           {rep.report_type === 'broken_equipment' ? 'Awaria Sprzętu' : 
                            rep.report_type === 'room_preparation' ? 'Przygotowanie Sali' : 'Inne'}
                         </span>
                         <span className="block text-xs text-slate-500 mt-1 max-w-[200px] truncate">{rep.description}</span>
                         <span className="block text-[9px] text-slate-600 mt-2 font-black uppercase">Zgłosił(a): {rep.first_name} {rep.last_name || rep.username}</span>
                       </td>
                       <td className="p-6">
                         {rep.room_number ? (
                            <span className="block text-slate-300 font-bold mb-1">Sala {rep.room_number} <span className="font-normal text-slate-500">({rep.building_code})</span></span>
                         ) : <span className="block text-slate-300 font-bold mb-1">Brak Sali</span>}

                         {rep.model_name && (
                            <span className="block text-amber-400/80 text-[10px] font-black uppercase flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              {rep.model_name} ({rep.serial_number})
                            </span>
                         )}
                       </td>
                       <td className="p-6">
                         <span className={`block text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded inline-block border mb-1 ${
                           rep.priority === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                           rep.priority === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                           'bg-slate-500/20 text-slate-400 border-slate-500/30'
                         }`}>
                           Priorytet: {rep.priority}
                         </span>
                         <span className="block text-slate-500 text-xs mt-1">Data: {dateStr}</span>
                       </td>
                       <td className="p-6 text-right">
                         {!isResolved ? (
                           <div className="flex flex-col items-end gap-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">OTWARTE</span>
                             {isStaff && <ResolveButton id={rep.id} />}
                           </div>
                         ) : (
                           <div className="flex flex-col items-end gap-1">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-500/10 border border-slate-500/20 px-3 py-1 rounded-full">ZAMKNIĘTE</span>
                             <span className="text-[9px] text-slate-600 block mt-1 uppercase">Przez: {rep.res_first} {rep.res_last || rep.res_user}</span>
                           </div>
                         )}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>

      </div>
    </div>
  );
}
