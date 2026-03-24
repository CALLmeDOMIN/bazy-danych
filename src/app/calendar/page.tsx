import sql from "@/db";
import CalendarGrid from "./CalendarGrid";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const rooms = await sql`
    SELECT r.id, r.room_number, r.capacity, b.name as building_name 
    FROM rooms r
    JOIN buildings b ON r.building_id = b.id
    WHERE r.status = 'available'
    ORDER BY b.name, r.room_number
  `;

  const bookings = await sql`
    SELECT 
      rb.id, rb.title, rb.reserved_date, rb.start_time, rb.end_time, rb.booking_type,
      r.room_number, b.code as building_code,
      u.first_name, u.last_name, u.username
    FROM room_bookings rb
    JOIN rooms r ON rb.room_id = r.id
    JOIN buildings b ON r.building_id = b.id
    JOIN users u ON rb.user_id = u.id
    WHERE rb.reserved_date IS NOT NULL
    ORDER BY rb.reserved_date ASC, rb.start_time ASC
  `;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-foreground">
            Planer <span className="text-primary italic">Zajęć</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest font-black flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]"></span>
            Zintegrowany Widok Tygodniowy (Teams Grid)
          </p>
        </div>
        
        <div className="hidden lg:flex gap-6 items-center bg-secondary/30 border border-border px-6 py-4 rounded-2xl">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-blue-600/20 border border-blue-600/50"></div>
             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Zajęcia</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-600/20 border border-emerald-600/50"></div>
             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Rezerwacje</span>
           </div>
        </div>
      </div>

      <CalendarGrid bookings={bookings} rooms={rooms} />

    </div>
  );
}
