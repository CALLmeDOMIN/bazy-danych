import { getAdminUsers, getDepartments } from "@/lib/admin-actions";
import CreateUserModal from "@/components/admin/CreateUserModal";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  const departments = await getDepartments();

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </Link>
            <h1 className="text-2xl font-serif font-black text-foreground">Zarządzanie Użytkownikami</h1>
          </div>
          <p className="text-sm text-muted-foreground">Twórz konta, przypisuj role i katedry zgodnie z regułami biznesowymi AGH.</p>
        </div>
        <CreateUserModal departments={departments} />
      </div>

      <div className="bg-secondary/40 border border-white/5 shadow-xl rounded-3xl p-6 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-black/20">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Imię i Nazwisko / Nick</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Rola i Przydział</th>
                <th className="px-4 py-3 text-center">Aktywność</th>
                <th className="px-4 py-3 rounded-r-lg text-center">Status Konta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u: any) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-bold text-foreground">{u.first_name} {u.last_name}</p>
                    <p className="text-xs text-indigo-400">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2">
                      {u.role}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">
                      {u.department_name || '-'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">
                    <span className={u.total_bookings > 0 ? "text-emerald-400" : "text-muted-foreground"}>
                      {u.total_bookings} Rezerwacji
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.is_active ? (
                      <span className="w-2 h-2 rounded-full border-[3px] shadow-[0_0_8px_rgba(16,185,129,0.5)] border-emerald-500 bg-emerald-500/20 inline-block"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full border-[3px] shadow-[0_0_8px_rgba(239,68,68,0.5)] border-red-500 bg-red-500/20 inline-block"></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
