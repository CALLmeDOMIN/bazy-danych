import sql from "@/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DeleteBookingButton from "./DeleteBookingButton";

export default async function MyReservationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const bookings = await sql`
    SELECT 
      rb.id, rb.title, rb.reserved_date, rb.start_time, rb.end_time, rb.booking_type,
      r.room_number, b.name as building_name,
      s.status_name, s.description
    FROM room_bookings rb
    JOIN rooms r ON rb.room_id = r.id
    JOIN buildings b ON r.building_id = b.id
    JOIN booking_statuses s ON rb.status_id = s.id
    WHERE rb.user_id = ${session.id}
    ORDER BY rb.reserved_date DESC, rb.start_time DESC
  `;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-white">
            Moje <span className="text-primary italic">Rezerwacje</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-black">
            Konto Osobiste - {session.first_name} {session.last_name || session.username}
          </p>
        </div>
      </div>

      <div className="glass-card p-1 rounded-3xl border border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
         
         {bookings.length === 0 ? (
           <div className="p-16 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">Brak Rezerwacji</h3>
             <p className="text-slate-500 text-sm">Nie dokonałeś jeszcze żadnych rezerwacji sal w systemie.</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b border-white/5 text-[10px] uppercase font-black tracking-widest text-slate-500">
                   <th className="p-6">Informacje o Wydarzeniu</th>
                   <th className="p-6">Termin (Data / Czas)</th>
                   <th className="p-6">Obiekt</th>
                   <th className="p-6">Status</th>
                   <th className="p-6 text-right">Akcje</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5 text-sm">
                 {bookings.map(booking => {
                   const dateStr = new Date(booking.reserved_date).toLocaleDateString();
                   const startTime = booking.start_time.substring(0, 5);
                   const endTime = booking.end_time.substring(0, 5);
                   
                   return (
                     <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-6">
                         <span className="block font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-wider text-xs">
                           {booking.title}
                         </span>
                         <span className="block text-xs text-slate-500 mt-1 uppercase tracking-widest">{booking.booking_type === 'class' ? 'Zajęcia' : 'Wydarzenie / Inne'}</span>
                       </td>
                       <td className="p-6">
                         <span className="block text-slate-300 font-bold">{dateStr}</span>
                         <span className="block text-slate-500 text-xs mt-1">{startTime} - {endTime}</span>
                       </td>
                       <td className="p-6">
                         <span className="block text-slate-300 font-medium">Sala {booking.room_number}</span>
                         <span className="block text-slate-500 text-xs mt-1 truncate max-w-[150px]">{booking.building_name}</span>
                       </td>
                       <td className="p-6">
                         <span title={booking.description} className="text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border bg-purple-500/10 text-purple-400 border-purple-500/20">
                           {booking.status_name}
                         </span>
                       </td>
                       <td className="p-6 text-right">
                         <DeleteBookingButton id={booking.id} />
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
         )}
      </div>

    </div>
  );
}
