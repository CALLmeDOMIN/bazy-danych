import { getRoomUtilizationStats, getAuditLogs } from "@/lib/admin-actions";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getRoomUtilizationStats();
  const logs = await getAuditLogs();

  return (
    <div className="space-y-8 fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-black mb-2 text-foreground">Panel Administratora</h1>
          <p className="text-muted-foreground text-sm font-medium">Zbiorcze statystyki i nadzór systemu.</p>
        </div>
        <Link href="/admin/users" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all">
          Zarządzaj Użytkownikami
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zaawansowany Widok: Wykorzystanie Sal */}
        <div className="bg-secondary/40 border border-white/5 shadow-xl rounded-3xl p-6 lg:p-8 backdrop-blur-sm relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 text-foreground font-serif">Wykorzystanie Sal (vw_room_utilization)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-black/20">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Sala / Budynek</th>
                  <th className="px-4 py-3 text-center">Rezerwacje</th>
                  <th className="px-4 py-3 text-center">Zgł. Techniczne</th>
                  <th className="px-4 py-3 rounded-r-lg text-center">Uszkodzony Sprzęt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.map((row: any) => (
                  <tr key={row.room_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-foreground">{row.room_number}</p>
                      <p className="text-xs text-muted-foreground">{row.building_name}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">{row.total_bookings}</td>
                    <td className="px-4 py-3 text-center font-medium text-amber-500">{row.total_maintenance_reports}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${row.broken_equipment_count > 0 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {row.broken_equipment_count} szt.
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-secondary/40 border border-white/5 shadow-xl rounded-3xl p-6 lg:p-8 backdrop-blur-sm relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 text-foreground font-serif">Logi Audytu Zmian Ról</h2>
          <div className="space-y-4">
            {logs.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    <span className="text-indigo-400">@{log.username}</span> - Akcja: {log.action_type}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Zmiana: <span className="line-through opacity-50">{log.old_role || 'BRAK'}</span> → <span className="font-bold text-emerald-400">{log.new_role}</span>
                  </p>
                </div>
                <div className="text-[10px] uppercase text-muted-foreground tracking-widest text-right">
                  {new Date(log.changed_at).toLocaleString('pl-PL')}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Brak logów ułatwiających audyt.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
