import sql from "@/db";
import SchedulesTable from "./SchedulesTable";

export default async function SchedulesPage() {
    const rows = await sql`
    SELECT 
      rb.id,
      rb.day_of_week,
      rb.start_time,
      rb.end_time,
      b.name AS building_name,
      r.room_number,
      rb.title as course_name,
      u.first_name AS prof_first,
      u.last_name AS prof_last,
      u.title AS prof_title,
      d.name AS dept_name
    FROM room_bookings rb
    INNER JOIN rooms r ON rb.room_id = r.id
    INNER JOIN buildings b ON r.building_id = b.id
    INNER JOIN users u ON rb.user_id = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    JOIN booking_statuses bs ON rb.status_id = bs.id
    WHERE bs.status_name = 'Zatwierdzona'
    ORDER BY rb.day_of_week ASC, rb.reserved_date ASC, rb.start_time ASC;
  `;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-10">
            <div className="relative p-10 rounded-3xl premium-gradient border border-white/5 overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="relative z-10">
                    <h1 className="text-4xl font-serif font-black mb-12 flex items-center gap-6">
        <span className="w-12 h-[2px] bg-primary/40"></span>
        Harmonogram <span className="text-primary italic">Zajęć</span>
      </h1>
              <p className="text-slate-400 mt-4 max-w-2xl text-lg font-medium leading-relaxed">
                        Zabezpieczony wgląd w archiwum obłożeń dydaktycznych. Dane synchronizowane są w czasie rzeczywistym z jednostkami planowania.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 relative z-10">
                    <span className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(56,189,248,0.8)]"></span>
                        Secure Protocol v4
                    </span>
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 bg-primary/5 blur-3xl pointer-events-none"></div>
            </div>

            <SchedulesTable rows={rows as any} />
        </div>
    );
}
